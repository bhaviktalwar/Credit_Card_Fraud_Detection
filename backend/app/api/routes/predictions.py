from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.ml_service import ml_service
from app.services.transaction_service import TransactionService
from app.schemas.transaction import (
    TransactionInput,
    PredictionResponse,
    BatchPredictionResponse,
    TransactionListResponse,
    TransactionDetail,
    DashboardStatsResponse,
    ModelMetricsResponse
)

router = APIRouter()

@router.get("/health", summary="Health check endpoint")
def health_check():
    return {
        "status": "healthy",
        "service": "FraudGuard AI Backend",
        "ml_model_loaded": ml_service.is_loaded,
        "selected_threshold": ml_service.threshold,
        "feature_count": len(ml_service.feature_columns),
        "error": ml_service.load_error
    }

@router.post("/predict", response_model=PredictionResponse, summary="Predict individual transaction fraud risk")
def predict_transaction(
    transaction: TransactionInput,
    db: Session = Depends(get_db)
):
    try:
        result = TransactionService.create_single_prediction(
            db=db,
            transaction_data=transaction,
            source="individual"
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/predict/batch", response_model=BatchPredictionResponse, summary="Upload CSV for batch transaction prediction")
async def predict_batch(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a CSV (.csv)")

    try:
        content = await file.read()
        return TransactionService.process_csv_batch(db=db, csv_content=content)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch processing error: {str(e)}")

@router.get("/transactions", response_model=TransactionListResponse, summary="Retrieve paginated transaction prediction history")
def list_transactions(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    prediction: Optional[int] = Query(None, description="Filter by prediction (0: genuine, 1: fraud)"),
    source: Optional[str] = Query(None, description="Filter by source (individual, batch)"),
    search: Optional[str] = Query(None, description="Search by ID or Batch ID"),
    db: Session = Depends(get_db)
):
    return TransactionService.get_transactions(
        db=db,
        page=page,
        page_size=page_size,
        prediction_filter=prediction,
        source_filter=source,
        search_query=search
    )

@router.get("/transactions/{transaction_id}", response_model=TransactionDetail, summary="Get transaction details by ID")
def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    record = TransactionService.get_transaction_by_id(db=db, transaction_id=transaction_id)
    if not record:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return record

@router.get("/dashboard/stats", response_model=DashboardStatsResponse, summary="Retrieve aggregated analytics for dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    return TransactionService.get_dashboard_stats(db=db)

@router.get("/model/metrics", response_model=ModelMetricsResponse, summary="Retrieve reported evaluation metrics and feature importances")
def get_model_metrics():
    return TransactionService.get_model_metrics()
