from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import get_current_user, require_roles
from app.db.database import get_connection
from app.models.schemas import UnemploymentRecordCreate


router = APIRouter(prefix="/unemployment-records", tags=["失业信息"])


@router.get("")
def list_unemployment_records(current_user: dict = Depends(get_current_user)) -> list[dict]:
    connection = get_connection()
    params: tuple = ()
    query = """
        SELECT ur.id, ur.report_type, ur.report_period, ur.unemployed_count, ur.layoffs,
               ur.workflow_status, e.name AS enterprise_name
        FROM unemployment_records ur
        JOIN enterprises e ON e.id = ur.enterprise_id
    """

    if current_user["role"] == "enterprise" and current_user.get("enterprise_id"):
        query += " WHERE ur.enterprise_id = ?"
        params = (current_user["enterprise_id"],)

    query += " ORDER BY ur.id ASC"
    rows = connection.execute(query, params).fetchall()
    connection.close()
    return [dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_unemployment_record(
    payload: UnemploymentRecordCreate,
    current_user: dict = Depends(require_roles("admin", "enterprise")),
) -> dict:
    if current_user["role"] == "enterprise" and current_user.get("enterprise_id") != payload.enterprise_id:
        raise HTTPException(status_code=403, detail="企业用户只能提交本企业数据")

    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO unemployment_records (
            enterprise_id, report_type, report_period, unemployed_count, layoffs,
            workflow_status, submitted_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload.enterprise_id,
            payload.report_type,
            payload.report_period,
            payload.unemployed_count,
            payload.layoffs,
            "draft" if current_user["role"] == "admin" else "city_pending",
            current_user["id"],
        ),
    )
    connection.commit()
    record_id = cursor.lastrowid
    connection.close()
    return {"id": record_id, "message": "失业记录创建成功"}
