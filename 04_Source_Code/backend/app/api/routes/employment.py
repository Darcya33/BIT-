from fastapi import APIRouter, status

from app.db.database import get_connection
from app.models.schemas import EmploymentRecordCreate


router = APIRouter(prefix="/employment-records", tags=["就业信息"])


@router.get("")
def list_employment_records() -> list[dict]:
    connection = get_connection()
    rows = connection.execute(
        """
        SELECT er.id, er.report_month, er.employed_count, er.new_hires, e.name AS enterprise_name
        FROM employment_records er
        JOIN enterprises e ON e.id = er.enterprise_id
        ORDER BY er.id ASC
        """
    ).fetchall()
    connection.close()
    return [dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_employment_record(payload: EmploymentRecordCreate) -> dict:
    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO employment_records (enterprise_id, report_month, employed_count, new_hires)
        VALUES (?, ?, ?, ?)
        """,
        (
            payload.enterprise_id,
            payload.report_month,
            payload.employed_count,
            payload.new_hires,
        ),
    )
    connection.commit()
    record_id = cursor.lastrowid
    connection.close()
    return {"id": record_id, "message": "就业记录创建成功"}
