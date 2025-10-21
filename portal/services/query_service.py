"""Functions to query and filter data, interface with the database, handle pagination, etc."""

import json
import sqlalchemy as db
from flask import Request
from portal.config import TRAITS

def get_trait_hits(engine: db.engine.Engine, trait_id: str) -> list:
    """Get all TWAS hits for a specific trait."""
    conn = engine.connect()
    
    # Find the trait name from the trait ID
    trait_name = None
    for trait in TRAITS:
        if trait['id'] == trait_id:
            trait_name = trait['name']
            break
    
    if not trait_name:
        conn.close()
        return []
    
    # Query the twas_hybrid table for the given trait name
    table = db.Table('twas_hybrid', db.MetaData(), autoload_with=engine)
    query = db.select(table).where(table.c.trait == trait_name)
    
    result = conn.execute(query).fetchall()
    hits = [dict(row._mapping) for row in result]
    
    conn.close()
    return hits

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
    conn = engine.connect()
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    
    # Get filter parameters
    filter_model = request.args.get('filterModel')
    
    table = db.Table(table_name, db.MetaData(), autoload_with=engine)
    query = db.select(table)
    
    # Apply filters if present
    if filter_model:
        filter_model = json.loads(filter_model)
        for field, filter_params in filter_model.items():
            # Handle custom select filter (multi-select checkbox)
            if filter_params.get('filterType') == 'select':
                selected_values = filter_params.get('values', [])
                if selected_values:
                    query = query.where(getattr(table.c, field).in_(selected_values))
            
            # Handle single filter condition
            elif 'type' in filter_params:
                filter_type = filter_params['type']
                filter_value = filter_params['filter']
                
                if filter_type == 'contains':
                    query = query.where(getattr(table.c, field).ilike(f'%{filter_value}%'))
                elif filter_type == 'equals':
                    query = query.where(getattr(table.c, field) == filter_value)
                elif filter_type == 'greaterThan':
                    query = query.where(getattr(table.c, field) > filter_value)
                elif filter_type == 'lessThan':
                    query = query.where(getattr(table.c, field) < filter_value)
            
            # Handle two filter conditions
            elif 'operator' in filter_params:
                conditions = []
                for condition in filter_params['conditions']:
                    filter_type = condition['type']
                    filter_value = condition['filter']
                    
                    if filter_type == 'contains':
                        conditions.append(getattr(table.c, field).ilike(f'%{filter_value}%'))
                    elif filter_type == 'equals':
                        conditions.append(getattr(table.c, field) == filter_value)
                    elif filter_type == 'greaterThan':
                        conditions.append(getattr(table.c, field) > filter_value)
                    elif filter_type == 'lessThan':
                        conditions.append(getattr(table.c, field) < filter_value)
                
                if filter_params['operator'] == 'AND':
                    query = query.where(db.and_(*conditions))
                else:  # OR
                    query = query.where(db.or_(*conditions))
    
    # Apply sorting
    query = query.order_by(db.text(f"{sort_by} {order}"))
    
    # Get total count before pagination
    count_query = db.select(db.func.count()).select_from(query.alias())
    total_count = conn.execute(count_query).scalar()
    
    # Apply pagination
    query = query.limit(limit).offset(offset)
    
    result = conn.execute(query).fetchall()
    response = {
        'rows': [dict(row._mapping) for row in result],
        'totalCount': total_count
    }
    return response
