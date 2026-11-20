import {
  HealthStatus,
  TransactionInputData,
  PredictionResult,
  BatchPredictionResult,
  TransactionListResponse,
  TransactionRecord,
  DashboardStats,
  ModelMetrics
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'API request failed';
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = `${res.status} ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<HealthStatus>(res);
  },

  async predictSingle(data: TransactionInputData): Promise<PredictionResult> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PredictionResult>(res);
  },

  async predictBatch(file: File): Promise<BatchPredictionResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/predict/batch`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<BatchPredictionResult>(res);
  },

  async getTransactions(params?: {
    page?: number;
    page_size?: number;
    prediction?: number;
    source?: string;
    search?: string;
  }): Promise<TransactionListResponse> {
    const url = new URL(`${API_BASE}/transactions`);
    if (params) {
      if (params.page !== undefined) url.searchParams.set('page', params.page.toString());
      if (params.page_size !== undefined) url.searchParams.set('page_size', params.page_size.toString());
      if (params.prediction !== undefined) url.searchParams.set('prediction', params.prediction.toString());
      if (params.source && params.source !== 'all') url.searchParams.set('source', params.source);
      if (params.search) url.searchParams.set('search', params.search);
    }
    const res = await fetch(url.toString());
    return handleResponse<TransactionListResponse>(res);
  },

  async getTransactionById(id: string): Promise<TransactionRecord> {
    const res = await fetch(`${API_BASE}/transactions/${id}`);
    return handleResponse<TransactionRecord>(res);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return handleResponse<DashboardStats>(res);
  },

  async getModelMetrics(): Promise<ModelMetrics> {
    const res = await fetch(`${API_BASE}/model/metrics`);
    return handleResponse<ModelMetrics>(res);
  }
};
