import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FraudGuard AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./fraud_detection.db"

    # ML Artifacts
    # Base path resolution ensures path works regardless of where uvicorn is launched
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    MODEL_DIR: str = os.path.join(
        BASE_DIR, "..", "Credit_Card_Fraud_Detection", "Models"
    ) if os.path.exists(os.path.join(BASE_DIR, "..", "Credit_Card_Fraud_Detection", "Models")) else os.path.join(
        BASE_DIR, "Credit_Card_Fraud_Detection", "Models"
    )
    MODEL_FILE: str = "xgboost_model.pkl"
    THRESHOLD_FILE: str = "xgboost_threshold.pkl"
    FEATURE_COLUMNS_FILE: str = "feature_columns.pkl"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
