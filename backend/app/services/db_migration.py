from sqlalchemy import text
from app.core.database import engine

def migrate_claims_table():
    """Add missing columns to the claims table if they don't exist"""
    with engine.connect() as conn:
        try:
            # Check if status column exists
            result = conn.execute(text("PRAGMA table_info(claims)"))
            columns = [row[1] for row in result.fetchall()]
            
            # Add missing columns if they don't exist
            if 'status' not in columns:
                conn.execute(text("ALTER TABLE claims ADD COLUMN status VARCHAR DEFAULT 'pending'"))
                conn.commit()
                print("Added status column to claims table")
                
            if 'error_type' not in columns:
                conn.execute(text("ALTER TABLE claims ADD COLUMN error_type VARCHAR"))
                conn.commit()
                print("Added error_type column to claims table")
                
            if 'error_explanation' not in columns:
                conn.execute(text("ALTER TABLE claims ADD COLUMN error_explanation VARCHAR"))
                conn.commit()
                print("Added error_explanation column to claims table")
                
            if 'recommended_action' not in columns:
                conn.execute(text("ALTER TABLE claims ADD COLUMN recommended_action VARCHAR"))
                conn.commit()
                print("Added recommended_action column to claims table")
                
        except Exception as e:
            print(f"Migration error: {e}")