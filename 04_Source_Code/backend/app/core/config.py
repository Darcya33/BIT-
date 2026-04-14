from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "云南省企业就业失业数据采集系统 API"
    app_version: str = "0.1.0"
    api_prefix: str = "/api/v1"
    cors_origins: list[str] = ["*"]


settings = Settings()
