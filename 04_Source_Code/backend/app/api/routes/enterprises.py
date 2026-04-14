from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import get_current_user, require_roles
from app.db.database import get_connection
from app.models.schemas import EnterpriseCreate, EnterpriseResponse, EnterpriseUpdate


router = APIRouter(prefix="/enterprises", tags=["企业信息"])


@router.get("", response_model=list[EnterpriseResponse])
def list_enterprises(current_user: dict = Depends(get_current_user)) -> list[dict]:
    connection = get_connection()
    if current_user["role"] == "enterprise" and current_user.get("enterprise_id"):
        rows = connection.execute(
            """
            SELECT id, name, social_credit_code, contact_person, contact_phone,
                   industry_type, city_name, province_name, reporting_frequency_rule, created_at
            FROM enterprises
            WHERE id = ?
            ORDER BY id ASC
            """,
            (current_user["enterprise_id"],),
        ).fetchall()
    else:
        rows = connection.execute(
            """
            SELECT id, name, social_credit_code, contact_person, contact_phone,
                   industry_type, city_name, province_name, reporting_frequency_rule, created_at
            FROM enterprises
            ORDER BY id ASC
            """
        ).fetchall()
    connection.close()
    return [dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_enterprise(
    payload: EnterpriseCreate,
    _: dict = Depends(require_roles("admin")),
) -> dict:
    connection = get_connection()
    cursor = connection.execute(
        """
        INSERT INTO enterprises (
            name, social_credit_code, contact_person, contact_phone,
            industry_type, city_name, province_name, reporting_frequency_rule
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload.name,
            payload.social_credit_code,
            payload.contact_person,
            payload.contact_phone,
            payload.industry_type,
            payload.city_name,
            payload.province_name,
            payload.reporting_frequency_rule,
        ),
    )
    connection.commit()
    enterprise_id = cursor.lastrowid
    connection.close()
    return {"id": enterprise_id, "message": "企业信息创建成功"}


@router.put("/{enterprise_id}")
def update_enterprise(
    enterprise_id: int,
    payload: EnterpriseUpdate,
    current_user: dict = Depends(get_current_user),
) -> dict:
    if current_user["role"] == "enterprise" and current_user.get("enterprise_id") != enterprise_id:
        raise HTTPException(status_code=403, detail="企业用户只能维护本企业信息")

    if current_user["role"] not in {"admin", "enterprise"}:
        raise HTTPException(status_code=403, detail="当前角色无权修改企业信息")

    connection = get_connection()
    existing = connection.execute(
        "SELECT id FROM enterprises WHERE id = ?",
        (enterprise_id,),
    ).fetchone()

    if existing is None:
        connection.close()
        raise HTTPException(status_code=404, detail="企业信息不存在")

    connection.execute(
        """
        UPDATE enterprises
        SET name = ?, social_credit_code = ?, contact_person = ?, contact_phone = ?,
            industry_type = ?, city_name = ?, province_name = ?, reporting_frequency_rule = ?
        WHERE id = ?
        """,
        (
            payload.name,
            payload.social_credit_code,
            payload.contact_person,
            payload.contact_phone,
            payload.industry_type,
            payload.city_name,
            payload.province_name,
            payload.reporting_frequency_rule,
            enterprise_id,
        ),
    )
    connection.commit()
    connection.close()
    return {"id": enterprise_id, "message": "企业信息更新成功"}
