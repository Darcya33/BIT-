from fastapi import APIRouter, HTTPException

from app.db.database import get_connection
from app.models.schemas import LoginRequest, LoginResponse


router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    connection = get_connection()
    row = connection.execute(
        "SELECT username, password, role FROM users WHERE username = ?",
        (payload.username,),
    ).fetchone()
    connection.close()

    if row is None or row["password"] != payload.password:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    return LoginResponse(
        message="登录成功",
        token="demo-token-for-course-project",
        role=row["role"],
    )
