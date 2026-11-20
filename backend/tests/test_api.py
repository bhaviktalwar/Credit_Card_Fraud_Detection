import pytest
import io
import pandas as pd
from fastapi.testclient import TestClient
from app.main import app
from app.services.ml_service import ml_service
from app.database.session import Base, engine

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ml_model_loaded"] is True
    assert data["feature_count"] == 30
    assert data["selected_threshold"] == 0.9

def test_model_metrics_endpoint():
    response = client.get("/api/model/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "XGBoost Classifier"
    assert len(data["models_comparison"]) == 4
    assert data["xgboost_metrics"]["f1_score"] == 0.8289
    assert data["confusion_matrix"]["true_positive"] == 109

def test_individual_prediction_genuine():
    features = {col: 0.0 for col in ml_service.feature_columns}
    features["Amount"] = 25.0
    features["Time"] = 120.0
    response = client.post("/api/predict", json=features)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["prediction"] in (0, 1)
    assert data["prediction_label"] in ("Genuine", "Fraudulent")
    assert 0.0 <= data["fraud_probability"] <= 1.0
    assert data["threshold"] == 0.9

def test_batch_prediction_csv():
    # Build a small CSV in memory
    cols = ml_service.feature_columns
    df = pd.DataFrame([
        {col: 0.0 for col in cols},
        {col: 0.0 for col in cols}
    ])
    df.loc[0, "Amount"] = 50.0
    df.loc[1, "Amount"] = 100.0

    csv_buffer = io.BytesIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    response = client.post(
        "/api/predict/batch",
        files={"file": ("test_batch.csv", csv_buffer.getvalue(), "text/csv")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["total_records"] == 2
    assert len(data["predictions"]) == 2

def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_transactions" in data
    assert "fraudulent_count" in data
    assert "genuine_count" in data
    assert "risk_distribution" in data

def test_transactions_history():
    response = client.get("/api/transactions?page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
