from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    try:
        with engine.connect() as connection:
            connection.exec_driver_sql("SELECT 1")
    except OperationalError as exc:
        raise RuntimeError(
            "Database is not ready. Run Alembic migrations first with "
            "'alembic -c .\\backend\\alembic.ini upgrade head'."
        ) from exc
