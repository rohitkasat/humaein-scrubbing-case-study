#!/usr/bin/env python3
"""
Database initialization script
"""
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy import create_engine
from app.core.database import Base
from app.core.config import settings
from app.models import user, claim, rule, metric

def init_db():
    """Initialize database tables"""
    engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {})
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()