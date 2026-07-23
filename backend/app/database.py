from sqlalchemy import create_engine
import app.config as config
from sqlalchemy.orm import sessionmaker,declarative_base

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
engine = create_engine(config.DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()