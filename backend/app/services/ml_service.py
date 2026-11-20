import os
import pickle
import warnings
from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np
from app.core.config import settings

class MLService:
    _instance = None

    def __init__(self):
        self.model = None
        self.threshold = 0.9
        self.feature_columns = []
        self.feature_importances = []
        self.is_loaded = False
        self.load_error = None
        self._load_artifacts()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_artifacts(self):
        # Resolve path to Models directory
        possible_dirs = [
            settings.MODEL_DIR,
            os.path.join(os.getcwd(), "Credit_Card_Fraud_Detection", "Models"),
            os.path.join(os.path.dirname(os.getcwd()), "Credit_Card_Fraud_Detection", "Models"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "Credit_Card_Fraud_Detection", "Models")),
            "E:/Credit-Card Fraud Detection/Credit_Card_Fraud_Detection/Models"
        ]

        model_dir = None
        for d in possible_dirs:
            if os.path.exists(d) and os.path.exists(os.path.join(d, settings.MODEL_FILE)):
                model_dir = d
                break

        if not model_dir:
            self.load_error = f"Model directory not found in candidate paths: {possible_dirs}"
            return

        try:
            model_path = os.path.join(model_dir, settings.MODEL_FILE)
            threshold_path = os.path.join(model_dir, settings.THRESHOLD_FILE)
            feature_columns_path = os.path.join(model_dir, settings.FEATURE_COLUMNS_FILE)

            with open(model_path, "rb") as f:
                self.model = pickle.load(f)

            with open(threshold_path, "rb") as f:
                loaded_thresh = pickle.load(f)
                self.threshold = float(loaded_thresh)

            with open(feature_columns_path, "rb") as f:
                self.feature_columns = pickle.load(f)

            # Compute or extract feature importance
            try:
                booster = self.model.get_booster()
                score_dict = booster.get_score(importance_type="gain")
                total_gain = sum(score_dict.values()) if score_dict else 1.0
                sorted_scores = sorted(score_dict.items(), key=lambda x: x[1], reverse=True)
                self.feature_importances = [
                    {"feature": k, "importance": round(v, 2), "weight": round((v / total_gain) * 100, 2)}
                    for k, v in sorted_scores
                ]
            except Exception as fe:
                self.feature_importances = []

            self.is_loaded = True
        except Exception as e:
            self.load_error = str(e)

    def calculate_risk_level(self, probability: float) -> str:
        if probability >= self.threshold:
            return "Critical" if probability >= 0.95 else "High"
        elif probability >= 0.5:
            return "Medium"
        else:
            return "Low"

    def predict_single(self, features_dict: Dict[str, float]) -> Tuple[int, str, float, float, str, List[Dict[str, Any]]]:
        if not self.is_loaded or self.model is None:
            raise RuntimeError(f"ML Model is not loaded. Error: {self.load_error}")

        # Ensure exact feature order according to feature_columns.pkl
        row_data = {}
        for col in self.feature_columns:
            if col not in features_dict:
                raise ValueError(f"Missing required feature: {col}")
            row_data[col] = float(features_dict[col])

        df = pd.DataFrame([row_data])[self.feature_columns]

        # Predict probability
        probs = self.model.predict_proba(df)[:, 1]
        fraud_prob = float(probs[0])
        pred_class = 1 if fraud_prob >= self.threshold else 0
        pred_label = "Fraudulent" if pred_class == 1 else "Genuine"
        risk_level = self.calculate_risk_level(fraud_prob)

        # Calculate top contributing features for individual transparency
        # Highlight top 3 sensitive features for this transaction
        top_contributors = []
        for imp in self.feature_importances[:5]:
            fname = imp["feature"]
            val = float(features_dict.get(fname, 0.0))
            top_contributors.append({
                "feature": fname,
                "value": round(val, 4),
                "importance_rank": imp["weight"]
            })

        return pred_class, pred_label, fraud_prob, self.threshold, risk_level, top_contributors

    def predict_batch(self, df_input: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        if not self.is_loaded or self.model is None:
            raise RuntimeError(f"ML Model is not loaded. Error: {self.load_error}")

        missing = [col for col in self.feature_columns if col not in df_input.columns]
        if missing:
            raise ValueError(f"Batch CSV is missing required feature columns: {missing[:5]}...")

        # Strict feature ordering
        df_ordered = df_input[self.feature_columns].astype(float)
        probabilities = self.model.predict_proba(df_ordered)[:, 1]
        predictions = (probabilities >= self.threshold).astype(int)

        return predictions, probabilities

ml_service = MLService.get_instance()
