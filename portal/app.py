"""Initialize Flask and register routes."""

from flask import Flask, request, jsonify, render_template, send_from_directory
import os
from sqlalchemy import create_engine
import sqlalchemy as db
from portal.config import DATA_DIR, DATABASE_URI, TISSUES, TRAITS
from portal.routes.api_routes import ag_grid_query
app = Flask(__name__)
engine = create_engine(DATABASE_URI)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download')
def download():
    return render_template('download.html')

@app.route('/data/<path:filename>')
def download_file(filename):
    return send_from_directory(
        DATA_DIR,
        filename,
        as_attachment=True,
    )

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
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
