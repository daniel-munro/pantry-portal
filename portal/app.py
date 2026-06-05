"""Initialize Flask and register routes."""

import os
from flask import Flask
from sqlalchemy import create_engine
from portal.settings import DATABASE_URI
from portal.routes.api_routes import api_bp
from portal.routes.views import views_bp

app = Flask(__name__)
engine = create_engine(DATABASE_URI)
app.config['DATABASE_ENGINE'] = engine

app.register_blueprint(views_bp)
app.register_blueprint(api_bp)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
