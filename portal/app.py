"""Initialize Flask and register routes."""

from flask import Flask, request, jsonify
from sqlalchemy import create_engine
import sqlalchemy as db
from portal.config import DATABASE_URI

app = Flask(__name__)
engine = create_engine(DATABASE_URI)

@app.route('/api/twas', methods=['GET'])
def get_data():
    conn = engine.connect()
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')

    query = db.text(f"SELECT * FROM data_table ORDER BY {sort_by} {order} LIMIT :limit OFFSET :offset")
    result = conn.execute(query, limit=limit, offset=offset).fetchall()

    response = [dict(row) for row in result]
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
