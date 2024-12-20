"""Handle rendering of web pages."""

from flask import render_template, send_from_directory
from portal.config import DATA_DIR

def init_views(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/browse')
    def browse():
        return render_template('browse.html')

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
