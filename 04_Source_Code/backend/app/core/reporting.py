from __future__ import annotations

from datetime import datetime

from fastapi import HTTPException, status


def validate_report_period(report_type: str, report_period: str) -> None:
    if report_type not in {"half_month", "monthly"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="报表类型不合法")

    if report_type == "half_month":
        try:
            date_part, half_part = report_period.rsplit("-", 1)
            parsed = datetime.strptime(date_part, "%Y-%m")
        except ValueError as error:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="半月报周期格式应为 YYYY-MM-H1/H2") from error

        if parsed.month not in {1, 2, 3}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="只有 1 至 3 月允许使用半月报")
        if half_part not in {"H1", "H2"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="半月报周期必须是 H1 或 H2")
        return

    try:
        parsed = datetime.strptime(report_period, "%Y-%m")
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="整月报周期格式应为 YYYY-MM") from error

    if parsed.month in {1, 2, 3}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="1 至 3 月必须按半月报填报")


def ensure_transition(current_status: str, allowed_statuses: set[str], error_message: str) -> None:
    if current_status not in allowed_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_message)
