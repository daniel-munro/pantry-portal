"""Handle rendering of web pages."""

from flask import Blueprint, render_template, send_from_directory
from portal.settings import DATA_DIR

views_bp = Blueprint('views', __name__)


@views_bp.route('/')
def index():
    return render_template('index.html')


@views_bp.route('/browse', strict_slashes=False)
def browse():
    return render_template('browse.html')


@views_bp.route('/download', strict_slashes=False)
def download():
    return render_template('download.html')


@views_bp.route('/traits', strict_slashes=False)
def traits():
    return render_template('traits.html')


@views_bp.route('/genes', strict_slashes=False)
def genes():
    return render_template('genes.html')


@views_bp.route('/data/<path:filename>')
def download_file(filename):
    return send_from_directory(
        DATA_DIR,
        filename,
        as_attachment=True,
    )
