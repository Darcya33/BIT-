from fastapi import APIRouter, status

from app.db.database import get_connection
from app.models.schemas import UnemploymentRecordCreate


router = APIRouter(prefix="/unemployment-records", tags=["失业信息"])


@router.get("")
def list_unemployment_records() -> list[dict]:
    connection = get_connection()
    rows = connection.execute(
        """
        SELECT ur.id, ur.report_month, ur.unemployed_count, ur.layoffs, e.name AS enterprise_name
        FROM unemployment_records ur
        JOIN enterprises e ON e.id = ur.enterprise_id
        ORDER BY ur.id ASC
        """
    ).fetchall()
    connection.close()
    return [dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_unemployment_record(payload: UnemploymentRecordCreate) -> dict:
    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO unemployment_records (enterprise_id, report_month, unemployed_count, layoffs)
        VALUES (?, ?, ?, ?)
        """,
        (
            payload.enterprise_id,
            payload.report_month,
            payload.unemployed_count,
            payload.layoffs,
        ),
    )
    connection.commit()
    record_id = cursor.lastrowid
    connection.close()
    return {"id": record_id, "message": "失业记录创建成功"}
