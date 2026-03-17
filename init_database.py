#!/usr/bin/env python
"""Initialize or reinitialize the database with all tables"""
import os
import sys
from pathlib import Path

# Add the backend directory to path
backend_dir = Path(__file__).parent / "echoscript-backend"
sys.path.insert(0, str(backend_dir))

from app.db import init_db
from app.models import Base, User, Subscription, Transcript

print("=" * 60)
print("Database Initialization Script")
print("=" * 60)

print("\n[1] Importing models...")
print(f"    ✓ User model")
print(f"    ✓ Subscription model")
print(f"    ✓ Transcript model")

print("\n[2] Initializing database tables...")
try:
    init_db()
    print("    ✓ Database initialized successfully")
except Exception as e:
    print(f"    ❌ Error: {e}")
    sys.exit(1)

print("\n[3] Verifying tables...")
from app.db import engine
from sqlalchemy import inspect

inspector = inspect(engine)
tables = inspector.get_table_names()

print(f"    Tables in database: {', '.join(tables)}")

required_tables = ["users", "subscriptions", "transcripts"]
missing_tables = [t for t in required_tables if t not in tables]

if missing_tables:
    print(f"    ❌ Missing tables: {', '.join(missing_tables)}")
    sys.exit(1)
else:
    print(f"    ✓ All required tables exist")

print("\n" + "=" * 60)
print("✓ Database initialization complete!")
print("=" * 60)
