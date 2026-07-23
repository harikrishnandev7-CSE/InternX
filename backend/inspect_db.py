from sqlalchemy import create_engine, inspect
import os
import sys

# Add backend directory to sys.path to enable imports from app
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from app.config import DATABASE_URL

def inspect_db():
    print(f"Connecting to database: {DATABASE_URL}")
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    
    for table_name in inspector.get_table_names():
        print(f"\nTable: {table_name}")
        for column in inspector.get_columns(table_name):
            print(f"  - {column['name']}: {column['type']} (nullable={column['nullable']})")

if __name__ == "__main__":
    inspect_db()
