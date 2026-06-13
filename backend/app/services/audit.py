import json

from sqlalchemy.orm import Session

from app.models import AuditLog


def record_audit(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: str,
    actor_user_id: int | None = None,
    metadata: dict | None = None,
) -> None:
    db.add(
        AuditLog(
            actor_user_id=actor_user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata_json=json.dumps(metadata or {}, ensure_ascii=True),
        )
    )

