from sqlalchemy import create_engine
import app.config as config
from sqlalchemy.orm import sessionmaker,declarative_base
from sqlalchemy.pool import QueuePool


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
engine = create_engine(
    config.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    poolclass=QueuePool,
)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()