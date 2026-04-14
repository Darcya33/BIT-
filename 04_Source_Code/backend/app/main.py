from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, employment, enterprises, stats, unemployment
from app.core.config import settings
from app.db.database import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {
        "message": "云南省企业就业失业数据采集系统后端骨架已启动",
        "docs": "/docs",
        "apiPrefix": settings.api_prefix,
    }


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": settings.app_name, "version": settings.app_version}


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(enterprises.router, prefix=settings.api_prefix)
app.include_router(employment.router, prefix=settings.api_prefix)
app.include_router(unemployment.router, prefix=settings.api_prefix)
app.include_router(stats.router, prefix=settings.api_prefix)
