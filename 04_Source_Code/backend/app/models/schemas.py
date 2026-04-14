from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)


class UserProfile(BaseModel):
    id: int
    username: str
    display_name: str
    role: str
    organization_name: str | None = None
    enterprise_id: int | None = None


class LoginResponse(BaseModel):
    message: str
    token: str
    user: UserProfile


class EnterpriseCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    social_credit_code: str = Field(..., min_length=6, max_length=30)
    contact_person: str = Field(..., min_length=2, max_length=50)
    contact_phone: str = Field(..., min_length=6, max_length=20)
    industry_type: str = Field(..., min_length=2, max_length=50)
    city_name: str = Field(..., min_length=2, max_length=50)
    province_name: str = Field(..., min_length=2, max_length=50)
    reporting_frequency_rule: str = Field(default="Q1_HALF_MONTH_OTHER_MONTHLY", min_length=3, max_length=50)


class EnterpriseUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    social_credit_code: str = Field(..., min_length=6, max_length=30)
    contact_person: str = Field(..., min_length=2, max_length=50)
    contact_phone: str = Field(..., min_length=6, max_length=20)
    industry_type: str = Field(..., min_length=2, max_length=50)
    city_name: str = Field(..., min_length=2, max_length=50)
    province_name: str = Field(..., min_length=2, max_length=50)
    reporting_frequency_rule: str = Field(default="Q1_HALF_MONTH_OTHER_MONTHLY", min_length=3, max_length=50)


class EnterpriseResponse(BaseModel):
    id: int
    name: str
    social_credit_code: str
    contact_person: str
    contact_phone: str
    industry_type: str
    city_name: str
    province_name: str
    reporting_frequency_rule: str
    created_at: str


class EmploymentRecordCreate(BaseModel):
    enterprise_id: int
    report_type: str = Field(..., min_length=5, max_length=20)
    report_period: str = Field(..., min_length=7, max_length=20)
    employed_count: int = Field(..., ge=0)
    new_hires: int = Field(..., ge=0)


class UnemploymentRecordCreate(BaseModel):
    enterprise_id: int
    report_type: str = Field(..., min_length=5, max_length=20)
    report_period: str = Field(..., min_length=7, max_length=20)
    unemployed_count: int = Field(..., ge=0)
    layoffs: int = Field(..., ge=0)


class WorkflowSubmitRequest(BaseModel):
    record_type: str = Field(..., min_length=5, max_length=20)
    record_id: int = Field(..., ge=1)


class WorkflowReviewRequest(BaseModel):
    record_type: str = Field(..., min_length=5, max_length=20)
    record_id: int = Field(..., ge=1)
    action: str = Field(..., min_length=6, max_length=20)
    review_comment: str = Field(..., min_length=2, max_length=200)
