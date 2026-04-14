from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_user
from app.db.database import get_connection
from app.models.schemas import LoginRequest, LoginResponse, RegisterRequest, UserProfile


router = APIRouter(prefix="/auth", tags=["认证"])

ALLOWED_REGISTER_ROLES = {"admin", "enterprise", "city_reviewer", "province_reviewer"}


def build_auth_response(row) -> LoginResponse:
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

    return build_auth_response(row)


@router.post("/register", response_model=LoginResponse)
def register(payload: RegisterRequest) -> LoginResponse:
    if payload.role not in ALLOWED_REGISTER_ROLES:
        raise HTTPException(status_code=400, detail="当前角色不支持注册")

    connection = get_connection()
    existing_user = connection.execute(
        "SELECT id FROM users WHERE username = ?",
        (payload.username,),
    ).fetchone()

    if existing_user is not None:
        connection.close()
        raise HTTPException(status_code=409, detail="用户名已存在，请更换后重试")

    enterprise_id = None
    organization_name = (payload.organization_name or "").strip()

    if payload.role == "enterprise":
        required_fields = {
            "enterprise_name": payload.enterprise_name,
            "social_credit_code": payload.social_credit_code,
            "contact_person": payload.contact_person,
            "contact_phone": payload.contact_phone,
            "city_name": payload.city_name,
            "province_name": payload.province_name,
        }
        missing_field = next((field for field, value in required_fields.items() if not value), None)
        if missing_field is not None:
            connection.close()
            raise HTTPException(status_code=400, detail="企业注册信息不完整，请补全后再提交")

        existing_enterprise = connection.execute(
            "SELECT id FROM enterprises WHERE social_credit_code = ?",
            (payload.social_credit_code.strip(),),
        ).fetchone()
        if existing_enterprise is not None:
            connection.close()
            raise HTTPException(status_code=409, detail="统一社会信用代码已存在，请核对后重试")

        cursor = connection.execute(
            """
            INSERT INTO enterprises
            (name, social_credit_code, contact_person, contact_phone, industry_type, city_name, province_name, reporting_frequency_rule)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.enterprise_name.strip(),
                payload.social_credit_code.strip(),
                payload.contact_person.strip(),
                payload.contact_phone.strip(),
                (payload.industry_type or "综合服务").strip(),
                (payload.city_name or "昆明市").strip(),
                (payload.province_name or "云南省").strip(),
                payload.reporting_frequency_rule or "Q1_HALF_MONTH_OTHER_MONTHLY",
            ),
        )
        enterprise_id = cursor.lastrowid
        organization_name = payload.enterprise_name.strip()
    else:
        if not organization_name:
            connection.close()
            raise HTTPException(status_code=400, detail="请填写所属单位或机构名称")

    cursor = connection.execute(
        """
        INSERT INTO users (username, password, role, display_name, organization_name, enterprise_id)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            payload.username.strip(),
            payload.password,
            payload.role,
            payload.display_name.strip(),
            organization_name,
            enterprise_id,
        ),
    )
    user_id = cursor.lastrowid
    connection.commit()

    row = connection.execute(
        """
        SELECT id, username, role, display_name, organization_name, enterprise_id
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    ).fetchone()
    connection.close()

    response = build_auth_response(row)
    response.message = "注册成功，已进入系统"
    return response


@router.get("/me", response_model=UserProfile)
def me(current_user: dict = Depends(get_current_user)) -> UserProfile:
    return UserProfile(**current_user)
