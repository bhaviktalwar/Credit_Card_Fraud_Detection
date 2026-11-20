from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

# Input transaction model with all 30 features
class TransactionInput(BaseModel):
    Time: float = Field(default=0.0, description="Seconds elapsed since first transaction")
    V1: float = Field(..., description="PCA Component V1")
    V2: float = Field(..., description="PCA Component V2")
    V3: float = Field(..., description="PCA Component V3")
    V4: float = Field(..., description="PCA Component V4")
    V5: float = Field(..., description="PCA Component V5")
    V6: float = Field(..., description="PCA Component V6")
    V7: float = Field(..., description="PCA Component V7")
    V8: float = Field(..., description="PCA Component V8")
    V9: float = Field(..., description="PCA Component V9")
    V10: float = Field(..., description="PCA Component V10")
    V11: float = Field(..., description="PCA Component V11")
    V12: float = Field(..., description="PCA Component V12")
    V13: float = Field(..., description="PCA Component V13")
    V14: float = Field(..., description="PCA Component V14")
    V15: float = Field(..., description="PCA Component V15")
    V16: float = Field(..., description="PCA Component V16")
    V17: float = Field(..., description="PCA Component V17")
    V18: float = Field(..., description="PCA Component V18")
    V19: float = Field(..., description="PCA Component V19")
    V20: float = Field(..., description="PCA Component V20")
    V21: float = Field(..., description="PCA Component V21")
    V22: float = Field(..., description="PCA Component V22")
    V23: float = Field(..., description="PCA Component V23")
    V24: float = Field(..., description="PCA Component V24")
    V25: float = Field(..., description="PCA Component V25")
    V26: float = Field(..., description="PCA Component V26")
    V27: float = Field(..., description="PCA Component V27")
    V28: float = Field(..., description="PCA Component V28")
    Amount: float = Field(..., ge=0.0, description="Transaction Amount in USD / EUR")

class PredictionResponse(BaseModel):
    id: str
    prediction: int = Field(..., description="0 for Genuine, 1 for Fraud")
    prediction_label: str = Field(..., description="'Genuine' or 'Fraudulent'")
    fraud_probability: float = Field(..., description="Predicted probability of fraud (0 to 1)")
    threshold: float = Field(..., description="Decision threshold applied")
    risk_level: str = Field(..., description="Low, Medium, High, or Critical")
    amount: float
    transaction_time: float
    created_at: str
    top_contributing_features: Optional[List[Dict[str, Any]]] = None

class BatchPredictionSummary(BaseModel):
    batch_id: str
    total_records: int
    genuine_count: int
    fraud_count: int
    fraud_rate_pct: float
    average_fraud_probability: float
    created_at: str

class BatchPredictionResponse(BaseModel):
    summary: BatchPredictionSummary
    predictions: List[PredictionResponse]

class TransactionDetail(BaseModel):
    id: str
    transaction_time: float
    amount: float
    prediction: int
    prediction_label: str
    fraud_probability: float
    threshold: float
    source: str
    batch_id: Optional[str] = None
    features: Optional[Dict[str, float]] = None
    created_at: str

class TransactionListResponse(BaseModel):
    items: List[TransactionDetail]
    total: int
    page: int
    page_size: int
    total_pages: int

class DashboardStatsResponse(BaseModel):
    total_transactions: int
    fraudulent_count: int
    genuine_count: int
    fraud_rate_pct: float
    avg_fraud_probability: float
    individual_count: int
    batch_count: int
    recent_transactions: List[TransactionDetail]
    risk_distribution: Dict[str, int]
    daily_trend: List[Dict[str, Any]]

class ModelMetricsResponse(BaseModel):
    model_name: str
    selected_threshold: float
    evaluation_dataset: Dict[str, Any]
    models_comparison: List[Dict[str, Any]]
    xgboost_metrics: Dict[str, Any]
    confusion_matrix: Dict[str, int]
    threshold_tuning_table: List[Dict[str, Any]]
    feature_importances: List[Dict[str, Any]]
