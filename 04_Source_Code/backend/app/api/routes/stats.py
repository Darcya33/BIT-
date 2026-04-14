from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.db.database import get_connection


router = APIRouter(prefix="/stats", tags=["统计"])


@router.get("/overview")
def overview(_: dict = Depends(get_current_user)) -> dict:
    connection = get_connection()

    enterprise_count = connection.execute("SELECT COUNT(*) FROM enterprises").fetchone()[0]
    employed_total = connection.execute(
        "SELECT COALESCE(SUM(employed_count), 0) FROM employment_records"
    ).fetchone()[0]
    unemployed_total = connection.execute(
        "SELECT COALESCE(SUM(unemployed_count), 0) FROM unemployment_records"
    ).fetchone()[0]
    new_hires_total = connection.execute(
        "SELECT COALESCE(SUM(new_hires), 0) FROM employment_records"
    ).fetchone()[0]
    city_pending_count = connection.execute(
        "SELECT COUNT(*) FROM employment_records WHERE workflow_status = 'city_pending'"
    ).fetchone()[0] + connection.execute(
        "SELECT COUNT(*) FROM unemployment_records WHERE workflow_status = 'city_pending'"
    ).fetchone()[0]
    province_pending_count = connection.execute(
        "SELECT COUNT(*) FROM employment_records WHERE workflow_status = 'province_pending'"
    ).fetchone()[0] + connection.execute(
        "SELECT COUNT(*) FROM unemployment_records WHERE workflow_status = 'province_pending'"
    ).fetchone()[0]

    connection.close()

    return {
        "enterpriseCount": enterprise_count,
        "employedTotal": employed_total,
        "unemployedTotal": unemployed_total,
        "newHiresTotal": new_hires_total,
        "cityPendingCount": city_pending_count,
        "provincePendingCount": province_pending_count,
    }
