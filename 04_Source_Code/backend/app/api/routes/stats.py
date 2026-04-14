from fastapi import APIRouter

from app.db.database import get_connection


router = APIRouter(prefix="/stats", tags=["统计"])


@router.get("/overview")
def overview() -> dict:
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

    connection.close()

    return {
        "enterpriseCount": enterprise_count,
        "employedTotal": employed_total,
        "unemployedTotal": unemployed_total,
        "newHiresTotal": new_hires_total,
    }
