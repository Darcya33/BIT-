from fastapi import APIRouter, status

from app.db.database import get_connection
from app.models.schemas import EnterpriseCreate


router = APIRouter(prefix="/enterprises", tags=["企业信息"])


@router.get("")
def list_enterprises() -> list[dict]:
    connection = get_connection()
    rows = connection.execute(
        """
        SELECT id, name, social_credit_code, contact_person, contact_phone, created_at
        FROM enterprises
        ORDER BY id ASC
        """
    ).fetchall()
    connection.close()
    return [dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_enterprise(payload: EnterpriseCreate) -> dict:
    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO enterprises (name, social_credit_code, contact_person, contact_phone)
        VALUES (?, ?, ?, ?)
        """,
        (
            payload.name,
            payload.social_credit_code,
            payload.contact_person,
            payload.contact_phone,
        ),
    )
    connection.commit()
    enterprise_id = cursor.lastrowid
    connection.close()
    return {"id": enterprise_id, "message": "企业信息创建成功"}
