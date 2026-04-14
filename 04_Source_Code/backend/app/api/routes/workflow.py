from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_user, require_roles
from app.core.reporting import ensure_transition
from app.db.database import get_connection
from app.models.schemas import WorkflowReviewRequest, WorkflowSubmitRequest


router = APIRouter(prefix="/workflow", tags=["上报与审核"])


def resolve_table_name(record_type: str) -> tuple[str, str, str]:
    if record_type == "employment":
        return "employment_records", "employment", "employed_count"
    if record_type == "unemployment":
        return "unemployment_records", "unemployment", "unemployed_count"
    raise HTTPException(status_code=400, detail="记录类型不合法")


@router.get("/queue")
def list_queue(current_user: dict = Depends(get_current_user)) -> list[dict]:
    connection = get_connection()
    queues: list[dict] = []

    filters: list[tuple[str, tuple]] = []
    if current_user["role"] == "city_reviewer":
        filters = [("city_pending", tuple())]
    elif current_user["role"] == "province_reviewer":
        filters = [("province_pending", tuple())]
    elif current_user["role"] == "enterprise" and current_user.get("enterprise_id"):
        filters = [("enterprise", (current_user["enterprise_id"],))]
    elif current_user["role"] == "admin":
        filters = [("all", tuple())]
    else:
        connection.close()
        return []

    for table_name, record_type, count_column in (
        ("employment_records", "employment", "employed_count"),
        ("unemployment_records", "unemployment", "unemployed_count"),
    ):
        for filter_name, params in filters:
            query = f"""
                SELECT r.id, r.report_type, r.report_period, r.workflow_status,
                       r.city_review_comment, r.province_review_comment, r.submitted_at,
                       r.{count_column} AS report_value, e.id AS enterprise_id, e.name AS enterprise_name
                FROM {table_name} r
                JOIN enterprises e ON e.id = r.enterprise_id
            """

            if filter_name == "city_pending":
                query += " WHERE r.workflow_status = 'city_pending'"
            elif filter_name == "province_pending":
                query += " WHERE r.workflow_status = 'province_pending'"
            elif filter_name == "enterprise":
                query += " WHERE r.enterprise_id = ?"

            query += " ORDER BY r.id DESC"

            rows = connection.execute(query, params).fetchall()
            queues.extend(
                {
                    **dict(row),
                    "record_type": record_type,
                }
                for row in rows
            )

    connection.close()
    return queues


@router.post("/submit")
def submit_record(
    payload: WorkflowSubmitRequest,
    current_user: dict = Depends(require_roles("enterprise", "admin")),
) -> dict:
    table_name, _, _ = resolve_table_name(payload.record_type)
    connection = get_connection()
    row = connection.execute(
        f"SELECT id, enterprise_id, workflow_status FROM {table_name} WHERE id = ?",
        (payload.record_id,),
    ).fetchone()

    if row is None:
        connection.close()
        raise HTTPException(status_code=404, detail="待提交记录不存在")

    if current_user["role"] == "enterprise" and current_user.get("enterprise_id") != row["enterprise_id"]:
        connection.close()
        raise HTTPException(status_code=403, detail="企业用户只能提交本企业记录")

    ensure_transition(
        row["workflow_status"],
        {"draft", "city_rejected", "province_rejected"},
        "当前记录状态不允许再次提交",
    )

    connection.execute(
        f"""
        UPDATE {table_name}
        SET workflow_status = 'city_pending', submitted_by = ?, submitted_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """,
        (current_user["id"], payload.record_id),
    )
    connection.commit()
    connection.close()
    return {"recordId": payload.record_id, "message": "记录已提交至市级审核"}


@router.post("/review")
def review_record(
    payload: WorkflowReviewRequest,
    current_user: dict = Depends(require_roles("city_reviewer", "province_reviewer")),
) -> dict:
    table_name, _, _ = resolve_table_name(payload.record_type)
    connection = get_connection()
    row = connection.execute(
        f"SELECT id, workflow_status FROM {table_name} WHERE id = ?",
        (payload.record_id,),
    ).fetchone()

    if row is None:
        connection.close()
        raise HTTPException(status_code=404, detail="待审核记录不存在")

    if payload.action not in {"approve", "reject"}:
        connection.close()
        raise HTTPException(status_code=400, detail="审核动作必须是 approve 或 reject")

    if current_user["role"] == "city_reviewer":
        ensure_transition(row["workflow_status"], {"city_pending"}, "当前记录不在市级待审状态")
        next_status = "province_pending" if payload.action == "approve" else "city_rejected"
        connection.execute(
            f"""
            UPDATE {table_name}
            SET workflow_status = ?, city_review_comment = ?
            WHERE id = ?
            """,
            (next_status, payload.review_comment, payload.record_id),
        )
        message = "市级审核已完成"
    else:
        ensure_transition(row["workflow_status"], {"province_pending"}, "当前记录不在省级待审状态")
        next_status = "approved" if payload.action == "approve" else "province_rejected"
        connection.execute(
            f"""
            UPDATE {table_name}
            SET workflow_status = ?, province_review_comment = ?
            WHERE id = ?
            """,
            (next_status, payload.review_comment, payload.record_id),
        )
        message = "省级审核已完成"

    connection.commit()
    connection.close()
    return {"recordId": payload.record_id, "message": message}
