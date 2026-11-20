import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Eye, 
  X, 
  RefreshCw,
  Database
} from 'lucide-react';
import { api } from '../services/api';
import { TransactionRecord, TransactionListResponse } from '../types';

export const HistoryPage: React.FC = () => {
  const [data, setData] = useState<TransactionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [predictionFilter, setPredictionFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TransactionRecord | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const pred = predictionFilter === 'all' ? undefined : parseInt(predictionFilter);
      const res = await api.getTransactions({
        page,
        page_size: pageSize,
        prediction: pred,
        source: sourceFilter === 'all' ? undefined : sourceFilter,
        search: searchQuery.trim() || undefined
      });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, predictionFilter, sourceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Transaction Prediction History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Persisted audit trail of individual checks and batch predictions stored in database.
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto hover:bg-slate-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search by Transaction ID or Batch ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Prediction:</span>
            <select
              value={predictionFilter}
              onChange={(e) => { setPredictionFilter(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
            >
              <option value="all">All Results</option>
              <option value="0">Genuine Only</option>
              <option value="1">Fraud Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
            >
              <option value="all">All Sources</option>
              <option value="individual">Individual</option>
              <option value="batch">Batch CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Fraud Probability</th>
                <th className="py-3 px-4">Threshold Applied</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
                    Fetching database records...
                  </td>
                </tr>
              ) : !data || data.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Database className="w-8 h-8 opacity-40 mx-auto mb-2" />
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                data.items.map((tx) => {
                  const isFraud = tx.prediction === 1;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                        {tx.id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isFraud
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                        }`}>
                          {isFraud ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {tx.prediction_label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-mono">
                          <span>{(tx.fraud_probability * 100).toFixed(2)}%</span>
                          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isFraud ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, tx.fraud_probability * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        τ = {tx.threshold.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {tx.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecord(tx)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition-colors text-xs font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {data.items.length} of {data.total} records (Page {data.page} of {data.total_pages})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= data.total_pages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-card max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              {selectedRecord.prediction === 1 ? (
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Transaction Audit Record
                </h3>
                <p className="text-xs font-mono text-slate-500">{selectedRecord.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-xs mb-6">
              <div>
                <span className="text-slate-500">Classification:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRecord.prediction_label}</p>
              </div>
              <div>
                <span className="text-slate-500">Fraud Score:</span>
                <p className="font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {(selectedRecord.fraud_probability * 100).toFixed(4)}%
                </p>
              </div>
              <div>
                <span className="text-slate-500">Amount:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">${selectedRecord.amount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-slate-500">Threshold:</span>
                <p className="font-bold font-mono text-slate-900 dark:text-white mt-0.5">τ = {selectedRecord.threshold.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-slate-500">Source:</span>
                <p className="font-bold capitalize text-slate-900 dark:text-white mt-0.5">{selectedRecord.source}</p>
              </div>
              <div>
                <span className="text-slate-500">Logged At:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {new Date(selectedRecord.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Feature Values Grid */}
            {selectedRecord.features && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Stored Transaction Features
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  {Object.entries(selectedRecord.features).map(([k, v]) => (
                    <div key={k} className="p-1.5 rounded bg-white dark:bg-slate-900 flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{v.toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
