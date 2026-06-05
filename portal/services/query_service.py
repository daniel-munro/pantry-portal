"""Functions to query and filter data, interface with the database, handle pagination, etc."""

import json
import sqlalchemy as db
from flask import Request
from portal.catalog import TRAITS

TRAIT_NAME_BY_ID = {trait['id']: trait['name'] for trait in TRAITS}

AG_GRID_TABLES = {
    'twas_hybrid',
    'twas_ddp',
    'qtls_hybrid',
    'qtls_ddp',
}

TWAS_HYBRID_COLUMNS = [
    'id',
    'trait',
    'tissue_name',
    'tissue',
    'gene_name',
    'gene_id',
    'gene_chrom',
    'gene_tss',
    'modality',
    'phenotype_id',
    'twas_p',
]


def _apply_filter_condition(query, table, field: str, filter_type: str, filter_value):
    """Apply one AG Grid filter condition to a SQLAlchemy query."""
    column = getattr(table.c, field)

    if filter_type == 'contains':
        return query.where(column.ilike(f'%{filter_value}%'))
    if filter_type == 'equals':
        return query.where(column == filter_value)
    if filter_type == 'greaterThan':
        return query.where(column > filter_value)
    if filter_type == 'lessThan':
        return query.where(column < filter_value)

    return query


def _build_filter_condition(table, field: str, filter_type: str, filter_value):
    """Build one SQLAlchemy condition for a compound AG Grid filter."""
    column = getattr(table.c, field)

    if filter_type == 'contains':
        return column.ilike(f'%{filter_value}%')
    if filter_type == 'equals':
        return column == filter_value
    if filter_type == 'greaterThan':
        return column > filter_value
    if filter_type == 'lessThan':
        return column < filter_value

    return None


def _apply_filter_model(query, table, filter_model_json):
    """Apply AG Grid's filterModel query parameter."""
    if not filter_model_json:
        return query

    filter_model = json.loads(filter_model_json)
    for field, filter_params in filter_model.items():
        if not hasattr(table.c, field):
            continue

        # Handle custom select filter (multi-select checkbox)
        if filter_params.get('filterType') == 'select':
            selected_values = filter_params.get('values', [])
            if selected_values:
                query = query.where(getattr(table.c, field).in_(selected_values))

        # Handle single filter condition
        elif 'type' in filter_params:
            query = _apply_filter_condition(
                query,
                table,
                field,
                filter_params['type'],
                filter_params.get('filter'),
            )

        # Handle two filter conditions
        elif 'operator' in filter_params:
            conditions = []
            for condition in filter_params['conditions']:
                built_condition = _build_filter_condition(
                    table,
                    field,
                    condition['type'],
                    condition.get('filter'),
                )
                if built_condition is not None:
                    conditions.append(built_condition)

            if conditions:
                if filter_params['operator'] == 'AND':
                    query = query.where(db.and_(*conditions))
                else:  # OR
                    query = query.where(db.or_(*conditions))

    return query


def _apply_sort(query, table, sort_by: str, order: str):
    """Apply a client-requested sort if it targets a real table column."""
    if not hasattr(table.c, sort_by):
        return query.order_by(table.c.id.asc())

    column = getattr(table.c, sort_by)
    if order == 'desc':
        return query.order_by(column.desc())
    return query.order_by(column.asc())


def _ag_grid_page(engine: db.engine.Engine, table, request: Request, query) -> dict:
    """Return one AG Grid page plus total row count for a filtered query."""
    limit = max(1, min(request.args.get('limit', 50, type=int), 500))
    offset = max(0, request.args.get('offset', 0, type=int))
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    filter_model = request.args.get('filterModel')

    query = _apply_filter_model(query, table, filter_model)

    # Count before limit/offset so AG Grid knows the full filtered row count.
    count_query = db.select(db.func.count()).select_from(query.alias())
    row_query = _apply_sort(query, table, sort_by, order).limit(limit).offset(offset)

    with engine.connect() as conn:
        total_count = conn.execute(count_query).scalar()
        result = conn.execute(row_query).fetchall()

    return {
        'rows': [dict(row._mapping) for row in result],
        'totalCount': total_count
    }


def get_trait_hits(engine: db.engine.Engine, trait_id: str, request: Request) -> dict:
    """Get one paginated page of TWAS hits for a specific trait."""
    trait_name = TRAIT_NAME_BY_ID.get(trait_id)
    if not trait_name:
        return {'rows': [], 'totalCount': 0}

    table = db.Table('twas_hybrid', db.MetaData(), autoload_with=engine)
    query = db.select(
        *(getattr(table.c, column) for column in TWAS_HYBRID_COLUMNS)
    ).where(table.c.trait == trait_name)

    return _ag_grid_page(engine, table, request, query)

def get_gene_hits(engine: db.engine.Engine, gene_id: str) -> list:
    """Get all TWAS hits for a specific gene."""
    conn = engine.connect()
    
    # Query the twas_hybrid table for the given gene_id
    table = db.Table('twas_hybrid', db.MetaData(), autoload_with=engine)
    query = db.select(table).where(table.c.gene_id == gene_id)
    
    result = conn.execute(query).fetchall()
    hits = [dict(row._mapping) for row in result]
    
    conn.close()
    return hits

def get_gene_qtls(engine: db.engine.Engine, gene_id: str) -> list:
    """Get all xQTLs for a specific gene."""
    conn = engine.connect()
    
    # Query the qtls_hybrid table for the given gene_id
    table = db.Table('qtls_hybrid', db.MetaData(), autoload_with=engine)
    query = db.select(table).where(table.c.gene_id == gene_id)
    
    result = conn.execute(query).fetchall()
    qtls = [dict(row._mapping) for row in result]
    
    conn.close()
    return qtls

def ag_grid_query(engine: db.engine.Engine, table_name: str, request: Request) -> dict:
    if table_name not in AG_GRID_TABLES:
        raise ValueError(f'Unsupported AG Grid table: {table_name}')

    table = db.Table(table_name, db.MetaData(), autoload_with=engine)
    query = db.select(table)
    return _ag_grid_page(engine, table, request, query)


def get_distinct_column_values(
    engine: db.engine.Engine,
    table_name: str,
    column_name: str,
) -> list:
    """Return sorted non-null distinct values for one table column."""
    table = db.Table(table_name, db.MetaData(), autoload_with=engine)
    column = getattr(table.c, column_name)
    query = db.select(column).distinct().where(column.is_not(None)).order_by(column)

    with engine.connect() as conn:
        result = conn.execute(query).fetchall()

    return [row[0] for row in result]
