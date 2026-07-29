from sqlalchemy import create_engine
from sqlalchemy import text

DATABASE_URL = "postgresql://ehrp_user:ehrp_password@localhost:5433/ehrp_db"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        print("✅ Connected!")
        print(result.fetchone())
except Exception as e:
    print("❌ Error:")
    print(e)