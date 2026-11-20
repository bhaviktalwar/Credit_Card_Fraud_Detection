export interface TransactionInputData {
  Time: number;
  Amount: number;
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  V8: number;
  V9: number;
  V10: number;
  V11: number;
  V12: number;
  V13: number;
  V14: number;
  V15: number;
  V16: number;
  V17: number;
  V18: number;
  V19: number;
  V20: number;
  V21: number;
  V22: number;
  V23: number;
  V24: number;
  V25: number;
  V26: number;
  V27: number;
  V28: number;
}

export interface ContributingFeature {
  feature: string;
  value: number;
  importance_rank: number;
}

export interface PredictionResult {
  id: string;
  prediction: number;
  prediction_label: 'Genuine' | 'Fraudulent';
  fraud_probability: number;
  threshold: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  amount: number;
  transaction_time: number;
  created_at: string;
  top_contributing_features?: ContributingFeature[];
}

export interface BatchSummary {
  batch_id: string;
  total_records: number;
  genuine_count: number;
  fraud_count: number;
  fraud_rate_pct: number;
  average_fraud_probability: number;
  created_at: string;
}

export interface BatchPredictionResult {
  summary: BatchSummary;
  predictions: PredictionResult[];
}

export interface TransactionRecord {
  id: string;
  transaction_time: number;
  amount: number;
  prediction: number;
  prediction_label: 'Genuine' | 'Fraudulent';
  fraud_probability: number;
  threshold: number;
  source: 'individual' | 'batch';
  batch_id?: string;
  features?: Record<string, number>;
  created_at: string;
}

export interface TransactionListResponse {
  items: TransactionRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DashboardStats {
  total_transactions: number;
  fraudulent_count: number;
  genuine_count: number;
  fraud_rate_pct: number;
  avg_fraud_probability: number;
  individual_count: number;
  batch_count: number;
  recent_transactions: TransactionRecord[];
  risk_distribution: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  daily_trend: Array<{
    date: string;
    genuine: number;
    fraud: number;
    total: number;
  }>;
}

export interface ModelComparisonItem {
  model: string;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  best: boolean;
}

export interface ThresholdItem {
  threshold: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  weight: number;
}

export interface ModelMetrics {
  model_name: string;
  selected_threshold: number;
  evaluation_dataset: {
    total_samples: number;
    test_samples: number;
    test_genuine: number;
    test_fraud: number;
    features_count: number;
    split_ratio: string;
    sampling_strategy: string;
  };
  models_comparison: ModelComparisonItem[];
  xgboost_metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    pr_auc: number;
  };
  confusion_matrix: {
    true_positive: number;
    false_positive: number;
    false_negative: number;
    true_negative: number;
  };
  threshold_tuning_table: ThresholdItem[];
  feature_importances: FeatureImportanceItem[];
}

export interface HealthStatus {
  status: string;
  service: string;
  ml_model_loaded: boolean;
  selected_threshold: number;
  feature_count: number;
  error?: string | null;
}
