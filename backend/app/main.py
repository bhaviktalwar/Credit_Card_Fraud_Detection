from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.database.session import Base, engine
from app.api.routes.predictions import router as predictions_router
from app.services.ml_service import ml_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables are created
    Base.metadata.create_all(bind=engine)
    print(f"[{settings.PROJECT_NAME}] Database tables verified / created.")
    if ml_service.is_loaded:
        print(f"[{settings.PROJECT_NAME}] XGBoost Model successfully loaded (threshold={ml_service.threshold}).")
    else:
        print(f"[{settings.PROJECT_NAME}] Warning: ML Model failed to load: {ml_service.load_error}")
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI/ML Credit Card Fraud Intelligence Platform API powered by trained XGBoost.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend on any local port or domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(predictions_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs"
    }
