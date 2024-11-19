"""Define REST API endpoints for serving data to the frontend, including pagination and filtering logic."""

import flask
import json
import sqlalchemy as db

def ag_grid_query(engine: db.engine.Engine, table_name: str, request: flask.Request) -> dict:
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
            # Handle single filter condition
            if 'type' in filter_params:
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
