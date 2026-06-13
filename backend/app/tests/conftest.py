from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.seed import seed


SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def override_get_db() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    app = create_app()
    app.dependency_overrides[get_db] = override_get_db

    db = TestingSessionLocal()
    from app.seed import seed as real_seed
    from app.db.session import SessionLocal
    import app.db.session as session_module

    original = session_module.SessionLocal
    session_module.SessionLocal = TestingSessionLocal
    try:
        real_seed()
    finally:
        session_module.SessionLocal = original
        db.close()

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def user_token(client: TestClient) -> str:
    response = client.post("/api/v1/auth/login", json={"email": "user@example.com", "password": "User1234!"})
    return response.json()["access_token"]


@pytest.fixture()
def admin_token(client: TestClient) -> str:
    response = client.post("/api/v1/auth/login", json={"email": "admin@example.com", "password": "Admin1234!"})
    return response.json()["access_token"]

