import os
import sys
from sqlalchemy import create_engine, text

# Add backend directory to sys.path to enable imports from app
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from app.config import DATABASE_URL
from app.utils.security import hash_password

def run_setup():
    print(f"Connecting to database: {DATABASE_URL}")
    engine = create_engine(DATABASE_URL)
    
    with engine.begin() as conn:
        # 1. Create admins table
        print("Checking/creating 'admins' table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        """))
        
        # 2. Create activity_logs table
        print("Checking/creating 'activity_logs' table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                action VARCHAR(100) NOT NULL,
                details TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        """))

        # 3. Add approval_status column to companies if it doesn't exist
        print("Checking 'approval_status' column in 'companies' table...")
        res = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'companies' AND column_name = 'approval_status';
        """)).fetchone()
        
        if not res:
            print("Adding 'approval_status' column to 'companies' table...")
            conn.execute(text("""
                ALTER TABLE companies ADD COLUMN approval_status VARCHAR(20) DEFAULT 'Pending' NOT NULL;
            """))
            # Sync existing companies based on is_approved boolean
            print("Syncing existing approved/pending companies...")
            conn.execute(text("""
                UPDATE companies SET approval_status = 'Approved' WHERE is_approved = TRUE;
            """))
            conn.execute(text("""
                UPDATE companies SET approval_status = 'Pending' WHERE is_approved = FALSE OR is_approved IS NULL;
            """))
        else:
            print("'approval_status' column already exists in 'companies' table.")

        # 4. Insert default admin if not exists
        print("Checking default admin...")
        admin_res = conn.execute(text("""
            SELECT id FROM admins WHERE email = 'admin@internx.com';
        """)).fetchone()
        
        if not admin_res:
            print("Inserting default admin 'admin@internx.com'...")
            hashed_pwd = hash_password("admin123")
            conn.execute(text("""
                INSERT INTO admins (full_name, email, hashed_password, is_active, created_at, updated_at)
                VALUES (:full_name, :email, :password, :is_active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            """), {
                "full_name": "System Admin",
                "email": "admin@internx.com",
                "password": hashed_pwd,
                "is_active": True
            })
            print("Default admin created successfully.")
        else:
            print("Default admin 'admin@internx.com' already exists.")
            
        # 5. Check/Add resume columns to students table if not exists
        print("Checking resume columns in 'students' table...")
        resume_cols = ["resume_url", "resume_public_id", "resume_filename", "resume_file_size", "resume_uploaded_at"]
        for col in resume_cols:
            col_res = conn.execute(text(f"""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'students' AND column_name = '{col}';
            """)).fetchone()
            if not col_res:
                print(f"Adding '{col}' column to 'students' table...")
                col_type = "VARCHAR"
                if col == "resume_file_size":
                    col_type = "INTEGER"
                elif col == "resume_uploaded_at":
                    col_type = "TIMESTAMP"
                conn.execute(text(f"ALTER TABLE students ADD COLUMN {col} {col_type};"))
            else:
                print(f"Column '{col}' already exists in 'students' table.")
            
    print("Database setup complete.")

if __name__ == "__main__":
    run_setup()

