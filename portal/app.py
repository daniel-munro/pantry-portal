"""Initialize Flask and register routes."""

from flask import Flask, request, jsonify, render_template
import json
from sqlalchemy import create_engine
import sqlalchemy as db
from .config import DATABASE_URI, TISSUES, TRAITS
from .routes.api_routes import ag_grid_query
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
    response = ag_grid_query(engine, 'twas_result', request)
    return jsonify(response)

@app.route('/api/qtls-combined', methods=['GET'])
def get_qtls_combined():
    response = ag_grid_query(engine, 'qtls_combined', request)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
