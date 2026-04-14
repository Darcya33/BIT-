from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import get_current_user, require_roles
from app.db.database import get_connection
from app.models.schemas import EmploymentRecordCreate


router = APIRouter(prefix="/employment-records", tags=["就业信息"])


@router.get("")
def list_employment_records(current_user: dict = Depends(get_current_user)) -> list[dict]:
    connection = get_connection()
    params: tuple = ()
    query = """
        SELECT er.id, er.report_type, er.report_period, er.employed_count, er.new_hires,
               er.workflow_status, e.name AS enterprise_name
        FROM employment_records er
        JOIN enterprises e ON e.id = er.enterprise_id
    """

    if current_user["role"] == "enterprise" and current_user.get("enterprise_id"):
        query += " WHERE er.enterprise_id = ?"
        params = (current_user["enterprise_id"],)

    query += " ORDER BY er.id ASC"
    rows = connection.execute(query, params).fetchall()
    connection.close()
    return [dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_employment_record(
    payload: EmploymentRecordCreate,
    current_user: dict = Depends(require_roles("admin", "enterprise")),
) -> dict:
    if current_user["role"] == "enterprise" and current_user.get("enterprise_id") != payload.enterprise_id:
        raise HTTPException(status_code=403, detail="企业用户只能提交本企业数据")

    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO employment_records (
            enterprise_id, report_type, report_period, employed_count, new_hires,
            workflow_status, submitted_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload.enterprise_id,
            payload.report_type,
            payload.report_period,
            payload.employed_count,
            payload.new_hires,
            "draft" if current_user["role"] == "admin" else "city_pending",
            current_user["id"],
        ),
    )
    connection.commit()
    record_id = cursor.lastrowid
    connection.close()
    return {"id": record_id, "message": "就业记录创建成功"}
