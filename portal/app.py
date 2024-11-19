"""Initialize Flask and register routes."""

from flask import Flask, request, jsonify, render_template
import json
from sqlalchemy import create_engine
import sqlalchemy as db
from .config import DATABASE_URI, TISSUES, TRAITS

app = Flask(__name__)
engine = create_engine(DATABASE_URI)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download')
def download():
    return render_template('download.html')

@app.route('/api/tissues')
def get_tissues():
    return jsonify(TISSUES)

@app.route('/api/traits')
def get_traits():
    return jsonify(TRAITS)

@app.route('/api/twas', methods=['GET'])
def get_twas():
    conn = engine.connect()
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    
    # Get filter parameters
    filter_model = request.args.get('filterModel')
    
    table = db.Table('twas_result', db.MetaData(), autoload_with=engine)
    query = db.select(table)
    
    # Apply filters if present
    if filter_model:
        filter_model = json.loads(filter_model)
        for field, filter_params in filter_model.items():
            filter_type = filter_params.get('type')
            filter_value = filter_params.get('filter')
            
            if filter_type == 'contains':
                query = query.where(getattr(table.c, field).ilike(f'%{filter_value}%'))
            elif filter_type == 'equals':
                query = query.where(getattr(table.c, field) == filter_value)
            elif filter_type == 'greaterThan':
                query = query.where(getattr(table.c, field) > float(filter_value))
            elif filter_type == 'lessThan':
                query = query.where(getattr(table.c, field) < float(filter_value))
    
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
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
