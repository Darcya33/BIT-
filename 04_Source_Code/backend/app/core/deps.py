from __future__ import annotations

from collections.abc import Callable

from fastapi import Depends, Header, HTTPException, status

from app.db.database import get_connection


def get_current_user(
    x_user_id: int | None = Header(default=None),
    x_user_role: str | None = Header(default=None),
) -> dict:
    if x_user_id is None or x_user_role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="当前请求缺少登录身份信息",
        )

    connection = get_connection()
    row = connection.execute(
        """
        SELECT id, username, display_name, role, organization_name, enterprise_id
        FROM users
        WHERE id = ?
        """,
        (x_user_id,),
    ).fetchone()
    connection.close()

    if row is None or row["role"] != x_user_role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="登录身份无效或已失效",
        )

    return dict(row)


def require_roles(*allowed_roles: str) -> Callable:
    def dependency(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="当前角色无权限执行此操作",
            )
        return current_user

    return dependency
