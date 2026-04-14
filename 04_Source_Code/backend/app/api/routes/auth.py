from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_user
from app.db.database import get_connection
from app.models.schemas import LoginRequest, LoginResponse, UserProfile


router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    connection = get_connection()
    row = connection.execute(
        """
        SELECT id, username, password, role, display_name, organization_name, enterprise_id
        FROM users
        WHERE username = ?
        """,
        (payload.username,),
    ).fetchone()
    connection.close()

    if row is None or row["password"] != payload.password:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    return LoginResponse(
        message="登录成功",
        token=f"demo-token-{row['id']}",
        user=UserProfile(
            id=row["id"],
            username=row["username"],
            display_name=row["display_name"],
            role=row["role"],
            organization_name=row["organization_name"],
            enterprise_id=row["enterprise_id"],
        ),
    )


@router.get("/me", response_model=UserProfile)
def me(current_user: dict = Depends(get_current_user)) -> UserProfile:
    return UserProfile(**current_user)
