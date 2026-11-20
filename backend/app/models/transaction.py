import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, JSON, Text
from app.database.session import Base

class TransactionPrediction(Base):
    __tablename__ = "transaction_predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    transaction_time = Column(Float, nullable=False, default=0.0)
    amount = Column(Float, nullable=False, default=0.0)
    prediction = Column(Integer, nullable=False)          # 0: Genuine, 1: Fraud
    prediction_label = Column(String(50), nullable=False) # Genuine / Fraudulent
    fraud_probability = Column(Float, nullable=False)     # 0.0 to 1.0
    threshold = Column(Float, nullable=False)             # Applied threshold (e.g. 0.9)
    source = Column(String(20), nullable=False, default="individual") # individual / batch
    batch_id = Column(String(36), nullable=True, index=True)
    features = Column(JSON, nullable=True)                # Dictionary of feature inputs V1..V28, Time, Amount
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "transaction_time": self.transaction_time,
            "amount": self.amount,
            "prediction": self.prediction,
            "prediction_label": self.prediction_label,
            "fraud_probability": round(self.fraud_probability, 6),
            "threshold": round(self.threshold, 4),
            "source": self.source,
            "batch_id": self.batch_id,
            "features": self.features,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
