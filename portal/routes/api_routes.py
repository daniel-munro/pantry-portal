"""Define REST API endpoints for serving data to the frontend."""

from flask import jsonify, request
from portal.config import TISSUES, TRAITS
from portal.services.query_service import ag_grid_query

def init_api_routes(app, engine):
    @app.route('/api/tissues')
    def get_tissues():
        return jsonify(TISSUES)

    @app.route('/api/traits')
    def get_traits():
        return jsonify(TRAITS)

    @app.route('/api/twas-hybrid', methods=['GET'])
    def get_twas():
        response = ag_grid_query(engine, 'twas_hybrid', request)
        return jsonify(response)

    @app.route('/api/twas-ddp', methods=['GET'])
    def get_twas_ddp():
        response = ag_grid_query(engine, 'twas_ddp', request)
        return jsonify(response)

    @app.route('/api/qtls-hybrid', methods=['GET'])
    def get_qtls_hybrid():
        response = ag_grid_query(engine, 'qtls_hybrid', request)
        return jsonify(response)

    @app.route('/api/qtls-ddp', methods=['GET'])
    def get_qtls_ddp():
        response = ag_grid_query(engine, 'qtls_ddp', request)
        return jsonify(response)
