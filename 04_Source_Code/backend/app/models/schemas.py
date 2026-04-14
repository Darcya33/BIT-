from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)


class LoginResponse(BaseModel):
    message: str
    token: str
    role: str


class EnterpriseCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    social_credit_code: str = Field(..., min_length=6, max_length=30)
    contact_person: str = Field(..., min_length=2, max_length=50)
    contact_phone: str = Field(..., min_length=6, max_length=20)


class EmploymentRecordCreate(BaseModel):
    enterprise_id: int
    report_month: str = Field(..., min_length=7, max_length=7)
    employed_count: int = Field(..., ge=0)
    new_hires: int = Field(..., ge=0)


class UnemploymentRecordCreate(BaseModel):
    enterprise_id: int
    report_month: str = Field(..., min_length=7, max_length=7)
    unemployed_count: int = Field(..., ge=0)
    layoffs: int = Field(..., ge=0)
