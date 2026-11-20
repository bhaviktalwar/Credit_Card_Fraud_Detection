import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
import io
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.models.transaction import TransactionPrediction
from app.services.ml_service import ml_service
from app.schemas.transaction import (
    TransactionInput,
    PredictionResponse,
    BatchPredictionResponse,
    BatchPredictionSummary,
    TransactionListResponse,
    TransactionDetail,
    DashboardStatsResponse,
    ModelMetricsResponse
)

class TransactionService:
    @staticmethod
    def create_single_prediction(
        db: Session,
        transaction_data: TransactionInput,
        source: str = "individual"
    ) -> PredictionResponse:
        features_dict = transaction_data.model_dump()
        amount = features_dict.get("Amount", 0.0)
        t_time = features_dict.get("Time", 0.0)

        pred_class, pred_label, fraud_prob, threshold, risk_level, top_contributors = (
            ml_service.predict_single(features_dict)
        )

        pred_id = str(uuid.uuid4())
        record = TransactionPrediction(
            id=pred_id,
            transaction_time=t_time,
            amount=amount,
            prediction=pred_class,
            prediction_label=pred_label,
            fraud_probability=fraud_prob,
            threshold=threshold,
            source=source,
            features=features_dict,
            created_at=datetime.utcnow()
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return PredictionResponse(
            id=record.id,
            prediction=record.prediction,
            prediction_label=record.prediction_label,
            fraud_probability=round(record.fraud_probability, 6),
            threshold=record.threshold,
            risk_level=risk_level,
            amount=record.amount,
            transaction_time=record.transaction_time,
            created_at=record.created_at.isoformat(),
            top_contributing_features=top_contributors
        )

    @staticmethod
    def process_csv_batch(
        db: Session,
        csv_content: bytes
    ) -> BatchPredictionResponse:
        try:
            df = pd.read_csv(io.BytesIO(csv_content))
        except Exception as e:
            raise ValueError(f"Failed to parse CSV file: {str(e)}")

        if df.empty:
            raise ValueError("Uploaded CSV is empty.")

        # Check maximum batch size for server safety (e.g., 5000 rows max per batch)
        if len(df) > 5000:
            raise ValueError("CSV contains more than 5,000 rows. Please upload in smaller batches.")

        predictions, probabilities = ml_service.predict_batch(df)

        batch_id = str(uuid.uuid4())
        created_at_dt = datetime.utcnow()
        created_at_str = created_at_dt.isoformat()

        records_to_insert = []
        response_items = []

        total = len(df)
        fraud_count = 0

        for i in range(total):
            row = df.iloc[i]
            pred_class = int(predictions[i])
            fraud_prob = float(probabilities[i])
            pred_label = "Fraudulent" if pred_class == 1 else "Genuine"
            risk_level = ml_service.calculate_risk_level(fraud_prob)
            if pred_class == 1:
                fraud_count += 1

            amount = float(row.get("Amount", 0.0))
            t_time = float(row.get("Time", 0.0))
            pred_id = str(uuid.uuid4())

            # Store feature subset or all features in JSON
            features_dict = {col: float(row[col]) for col in ml_service.feature_columns if col in row}

            records_to_insert.append(
                TransactionPrediction(
                    id=pred_id,
                    transaction_time=t_time,
                    amount=amount,
                    prediction=pred_class,
                    prediction_label=pred_label,
                    fraud_probability=fraud_prob,
                    threshold=ml_service.threshold,
                    source="batch",
                    batch_id=batch_id,
                    features=features_dict,
                    created_at=created_at_dt
                )
            )

            response_items.append(
                PredictionResponse(
                    id=pred_id,
                    prediction=pred_class,
                    prediction_label=pred_label,
                    fraud_probability=round(fraud_prob, 6),
                    threshold=ml_service.threshold,
                    risk_level=risk_level,
                    amount=amount,
                    transaction_time=t_time,
                    created_at=created_at_str,
                    top_contributing_features=None
                )
            )

        db.bulk_save_objects(records_to_insert)
        db.commit()

        genuine_count = total - fraud_count
        fraud_rate = round((fraud_count / total) * 100, 2) if total > 0 else 0.0
        avg_prob = round(float(probabilities.mean()), 4) if total > 0 else 0.0

        summary = BatchPredictionSummary(
            batch_id=batch_id,
            total_records=total,
            genuine_count=genuine_count,
            fraud_count=fraud_count,
            fraud_rate_pct=fraud_rate,
            average_fraud_probability=avg_prob,
            created_at=created_at_str
        )

        return BatchPredictionResponse(
            summary=summary,
            predictions=response_items
        )

    @staticmethod
    def get_transactions(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        prediction_filter: Optional[int] = None,
        source_filter: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> TransactionListResponse:
        query = db.query(TransactionPrediction)

        if prediction_filter is not None:
            query = query.filter(TransactionPrediction.prediction == prediction_filter)

        if source_filter and source_filter.lower() != "all":
            query = query.filter(TransactionPrediction.source == source_filter.lower())

        if search_query:
            query = query.filter(
                (TransactionPrediction.id.like(f"%{search_query}%")) |
                (TransactionPrediction.batch_id.like(f"%{search_query}%"))
            )

        total = query.count()
        offset = (page - 1) * page_size
        items = query.order_by(desc(TransactionPrediction.created_at)).offset(offset).limit(page_size).all()

        total_pages = (total + page_size - 1) // page_size if total > 0 else 1

        detail_items = [
            TransactionDetail(
                id=item.id,
                transaction_time=item.transaction_time,
                amount=item.amount,
                prediction=item.prediction,
                prediction_label=item.prediction_label,
                fraud_probability=round(item.fraud_probability, 6),
                threshold=item.threshold,
                source=item.source,
                batch_id=item.batch_id,
                features=item.features,
                created_at=item.created_at.isoformat()
            )
            for item in items
        ]

        return TransactionListResponse(
            items=detail_items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )

    @staticmethod
    def get_transaction_by_id(db: Session, transaction_id: str) -> Optional[TransactionDetail]:
        item = db.query(TransactionPrediction).filter(TransactionPrediction.id == transaction_id).first()
        if not item:
            return None

        return TransactionDetail(
            id=item.id,
            transaction_time=item.transaction_time,
            amount=item.amount,
            prediction=item.prediction,
            prediction_label=item.prediction_label,
            fraud_probability=round(item.fraud_probability, 6),
            threshold=item.threshold,
            source=item.source,
            batch_id=item.batch_id,
            features=item.features,
            created_at=item.created_at.isoformat()
        )

    @staticmethod
    def get_dashboard_stats(db: Session) -> DashboardStatsResponse:
        total = db.query(TransactionPrediction).count()
        fraud_count = db.query(TransactionPrediction).filter(TransactionPrediction.prediction == 1).count()
        genuine_count = total - fraud_count

        fraud_rate = round((fraud_count / total) * 100, 2) if total > 0 else 0.0

        avg_prob_res = db.query(func.avg(TransactionPrediction.fraud_probability)).scalar()
        avg_prob = round(float(avg_prob_res), 4) if avg_prob_res is not None else 0.0

        ind_count = db.query(TransactionPrediction).filter(TransactionPrediction.source == "individual").count()
        batch_count = db.query(TransactionPrediction).filter(TransactionPrediction.source == "batch").count()

        # Risk breakdown
        critical_count = db.query(TransactionPrediction).filter(TransactionPrediction.fraud_probability >= 0.95).count()
        high_count = db.query(TransactionPrediction).filter(
            (TransactionPrediction.fraud_probability >= ml_service.threshold) & (TransactionPrediction.fraud_probability < 0.95)
        ).count()
        medium_count = db.query(TransactionPrediction).filter(
            (TransactionPrediction.fraud_probability >= 0.5) & (TransactionPrediction.fraud_probability < ml_service.threshold)
        ).count()
        low_count = total - (critical_count + high_count + medium_count)

        recent_items = (
            db.query(TransactionPrediction)
            .order_by(desc(TransactionPrediction.created_at))
            .limit(10)
            .all()
        )

        recent_list = [
            TransactionDetail(
                id=item.id,
                transaction_time=item.transaction_time,
                amount=item.amount,
                prediction=item.prediction,
                prediction_label=item.prediction_label,
                fraud_probability=round(item.fraud_probability, 6),
                threshold=item.threshold,
                source=item.source,
                batch_id=item.batch_id,
                features=item.features,
                created_at=item.created_at.isoformat()
            )
            for item in recent_items
        ]

        # Daily Trend (group by date)
        # SQLite / Postgres compatible date aggregation
        records = db.query(
            TransactionPrediction.created_at,
            TransactionPrediction.prediction
        ).all()

        daily_map: Dict[str, Dict[str, int]] = {}
        for r_dt, r_pred in records:
            day_str = r_dt.strftime("%Y-%m-%d") if r_dt else "Unknown"
            if day_str not in daily_map:
                daily_map[day_str] = {"date": day_str, "genuine": 0, "fraud": 0, "total": 0}
            daily_map[day_str]["total"] += 1
            if r_pred == 1:
                daily_map[day_str]["fraud"] += 1
            else:
                daily_map[day_str]["genuine"] += 1

        daily_trend = sorted(list(daily_map.values()), key=lambda x: x["date"])

        return DashboardStatsResponse(
            total_transactions=total,
            fraudulent_count=fraud_count,
            genuine_count=genuine_count,
            fraud_rate_pct=fraud_rate,
            avg_fraud_probability=avg_prob,
            individual_count=ind_count,
            batch_count=batch_count,
            recent_transactions=recent_list,
            risk_distribution={
                "Critical": critical_count,
                "High": high_count,
                "Medium": medium_count,
                "Low": max(0, low_count)
            },
            daily_trend=daily_trend
        )

    @staticmethod
    def get_model_metrics() -> ModelMetricsResponse:
        # Authentic metrics verified from README.md and 05_XGBoost.ipynb
        comparison = [
            {"model": "Logistic Regression", "precision": 0.0503, "recall": 0.8803, "f1_score": 0.0952, "roc_auc": 0.9665, "pr_auc": 0.6913, "best": False},
            {"model": "Random Forest", "precision": 0.9643, "recall": 0.5704, "f1_score": 0.7168, "roc_auc": 0.9669, "pr_auc": 0.8204, "best": False},
            {"model": "XGBoost", "precision": 0.9008, "recall": 0.7676, "f1_score": 0.8289, "roc_auc": 0.9634, "pr_auc": 0.8004, "best": True},
            {"model": "LightGBM", "precision": 0.9174, "recall": 0.7042, "f1_score": 0.7968, "roc_auc": 0.9599, "pr_auc": 0.7114, "best": False}
        ]

        threshold_tuning = [
            {"threshold": 0.1, "precision": 0.2569, "recall": 0.8485, "f1_score": 0.3944},
            {"threshold": 0.2, "precision": 0.3986, "recall": 0.8333, "f1_score": 0.5392},
            {"threshold": 0.3, "precision": 0.5294, "recall": 0.8182, "f1_score": 0.6429},
            {"threshold": 0.4, "precision": 0.6585, "recall": 0.8182, "f1_score": 0.7297},
            {"threshold": 0.5, "precision": 0.7714, "recall": 0.8182, "f1_score": 0.7941},
            {"threshold": 0.6, "precision": 0.8182, "recall": 0.8182, "f1_score": 0.8182},
            {"threshold": 0.7, "precision": 0.8438, "recall": 0.8182, "f1_score": 0.8308},
            {"threshold": 0.8, "precision": 0.8548, "recall": 0.8030, "f1_score": 0.8281},
            {"threshold": 0.9, "precision": 0.8983, "recall": 0.8030, "f1_score": 0.8480}
        ]

        return ModelMetricsResponse(
            model_name="XGBoost Classifier",
            selected_threshold=ml_service.threshold,
            evaluation_dataset={
                "total_samples": 284807,
                "test_samples": 85118,
                "test_genuine": 84976,
                "test_fraud": 142,
                "features_count": 30,
                "split_ratio": "80% Train, 20% Test (Stratified)",
                "sampling_strategy": "SMOTE applied strictly on Training Set"
            },
            models_comparison=comparison,
            xgboost_metrics={
                "precision": 0.9008,
                "recall": 0.7676,
                "f1_score": 0.8289,
                "roc_auc": 0.9634,
                "pr_auc": 0.8004
            },
            confusion_matrix={
                "true_positive": 109,
                "false_positive": 12,
                "false_negative": 33,
                "true_negative": 84964
            },
            threshold_tuning_table=threshold_tuning,
            feature_importances=ml_service.feature_importances[:15]
        )
