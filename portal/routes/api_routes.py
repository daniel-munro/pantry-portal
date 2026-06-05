"""Define REST API endpoints for serving data to the frontend."""

from flask import Blueprint, current_app, jsonify, request
from portal.catalog import (
    BROWSE_MODALITIES,
    CHROMOSOMES,
    DOWNLOAD_MODALITIES,
    DOWNLOAD_QTL_MODALITIES,
    GENES,
    TISSUES,
    TRAIT_CATEGORIES,
    TRAITS,
)
from portal.services.query_service import (
    ag_grid_query,
    get_distinct_column_values,
    get_gene_hits,
    get_gene_qtls,
    get_trait_hits,
)

api_bp = Blueprint('api', __name__, url_prefix='/api')


def get_engine():
    """Return the database engine configured for API route handlers."""
    return current_app.config['DATABASE_ENGINE']


@api_bp.route('/tissues')
def get_tissues():
    return jsonify(TISSUES)


@api_bp.route('/traits')
def get_traits():
    return jsonify(TRAITS)


@api_bp.route('/genes')
def get_genes():
    return jsonify(GENES)


@api_bp.route('/metadata')
def get_metadata():
    engine = get_engine()
    return jsonify({
        'browseModalities': BROWSE_MODALITIES,
        'chromosomes': CHROMOSOMES,
        'downloadModalities': DOWNLOAD_MODALITIES,
        'downloadQtlModalities': DOWNLOAD_QTL_MODALITIES,
        'tissueNames': get_distinct_column_values(
            engine,
            'twas_hybrid',
            'tissue_name',
        ),
        'tissues': TISSUES,
        'traitCategories': TRAIT_CATEGORIES,
    })


@api_bp.route('/trait-hits/<trait_id>')
def get_trait_hits_api(trait_id):
    response = get_trait_hits(get_engine(), trait_id, request)
    return jsonify(response)


@api_bp.route('/gene-hits/<gene_id>')
def get_gene_hits_api(gene_id):
    hits = get_gene_hits(get_engine(), gene_id)
    return jsonify({'hits': hits})


@api_bp.route('/gene-qtls/<gene_id>')
def get_gene_qtls_api(gene_id):
    qtls = get_gene_qtls(get_engine(), gene_id)
    return jsonify({'qtls': qtls})


@api_bp.route('/twas-hybrid', methods=['GET'])
def get_twas():
    response = ag_grid_query(get_engine(), 'twas_hybrid', request)
    return jsonify(response)


@api_bp.route('/twas-ddp', methods=['GET'])
def get_twas_ddp():
    response = ag_grid_query(get_engine(), 'twas_ddp', request)
    return jsonify(response)


@api_bp.route('/qtls-hybrid', methods=['GET'])
def get_qtls_hybrid():
    response = ag_grid_query(get_engine(), 'qtls_hybrid', request)
    return jsonify(response)


@api_bp.route('/qtls-ddp', methods=['GET'])
def get_qtls_ddp():
    response = ag_grid_query(get_engine(), 'qtls_ddp', request)
    return jsonify(response)
