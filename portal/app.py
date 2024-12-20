"""Initialize Flask and register routes."""

import os
from flask import Flask
from sqlalchemy import create_engine
from portal.config import DATABASE_URI
from portal.routes.api_routes import init_api_routes
from portal.routes.views import init_views

app = Flask(__name__)
engine = create_engine(DATABASE_URI)

# Register routes
init_views(app)
init_api_routes(app, engine)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
