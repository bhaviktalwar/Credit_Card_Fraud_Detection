import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Percent, 
  Database, 
  Search, 
  ArrowUpRight,
  Layers,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { api } from '../services/api';
import { DashboardStats } from '../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieColors = ['#10b981', '#ef4444'];
  const riskColors = {
    Low: '#10b981',
    Medium: '#f59e0b',
    High: '#f97316',
    Critical: '#ef4444'
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Loading Live Analytics...</h3>
        <p className="text-sm text-slate-500">Querying real transaction prediction database.</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-4 max-w-md mx-auto rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <h3 className="font-bold text-base">Backend Connection Notice</h3>
          <p className="text-xs mt-1">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const hasData = stats && stats.total_transactions > 0;

  const pieData = hasData ? [
    { name: 'Genuine', value: stats.genuine_count },
    { name: 'Fraudulent', value: stats.fraudulent_count },
  ] : [];

  const riskData = hasData ? [
    { name: 'Low Risk (<0.50)', count: stats.risk_distribution.Low, fill: '#10b981' },
    { name: 'Medium (0.50 - 0.89)', count: stats.risk_distribution.Medium, fill: '#f59e0b' },
    { name: 'High (0.90 - 0.94)', count: stats.risk_distribution.High, fill: '#f97316' },
    { name: 'Critical (≥0.95)', count: stats.risk_distribution.Critical, fill: '#ef4444' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Fraud Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time transaction surveillance & persistent machine learning prediction metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <Link
            to="/detect"
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Analyze Transaction
          </Link>
        </div>
      </div>

      {/* Primary Metrics 4-Card Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Processed */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL ANALYZED</span>
            <Database className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {stats ? stats.total_transactions.toLocaleString() : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>{stats?.individual_count || 0} Individual</span>
            <span>•</span>
            <span>{stats?.batch_count || 0} Batch Rows</span>
          </div>
        </div>

        {/* Fraudulent Count */}
        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>FRAUD DETECTED</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight">
            {stats ? stats.fraudulent_count.toLocaleString() : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Flagged via threshold τ = 0.90
          </div>
        </div>

        {/* Genuine Transactions */}
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>GENUINE CONFIRMED</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {stats ? stats.genuine_count.toLocaleString() : '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Safe transactions cleared
          </div>
        </div>

        {/* Fraud Detection Rate */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>FRAUD RATE</span>
            <Percent className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {stats ? `${stats.fraud_rate_pct.toFixed(2)}%` : '0.00%'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Avg Fraud Score: {stats ? (stats.avg_fraud_probability * 100).toFixed(2) : 0}%
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart: Genuine vs Fraud Distribution */}
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Class Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">Ratio of genuine to detected fraudulent transactions.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs font-medium pt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Genuine ({stats.genuine_count})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span>Fraud ({stats.fraudulent_count})</span>
              </div>
            </div>
          </div>

          {/* Bar Chart: Risk Level Breakdown */}
          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Fraud Risk Tier Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">Volume grouped by model predicted risk score ranges.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px' 
                    }} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Transactions">
                    {riskData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                <span className="text-slate-500">Low:</span> <strong className="text-emerald-500">{stats.risk_distribution.Low}</strong>
              </div>
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                <span className="text-slate-500">Medium:</span> <strong className="text-amber-500">{stats.risk_distribution.Medium}</strong>
              </div>
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                <span className="text-slate-500">High:</span> <strong className="text-orange-500">{stats.risk_distribution.High}</strong>
              </div>
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                <span className="text-slate-500">Critical:</span> <strong className="text-red-500">{stats.risk_distribution.Critical}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State for Fresh Installation */
        <div className="glass-card p-12 text-center border-dashed border-2">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            No Transactions Evaluated Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            The database is currently clean with zero recorded predictions. Run an individual transaction scoring or upload a CSV batch to view real-time statistics.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/detect"
              className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow transition-colors"
            >
              Run First Prediction
            </Link>
          </div>
        </div>
      )}

      {/* Recent Predictions Table */}
      {hasData && (
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-xs text-slate-500">Latest predictions stored in database.</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center gap-1"
            >
              View Full History <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Prediction</th>
                  <th className="py-3 px-4">Fraud Probability</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {stats.recent_transactions.map((tx) => {
                  const isFraud = tx.prediction === 1;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
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
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{(tx.fraud_probability * 100).toFixed(2)}%</span>
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isFraud ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min(100, tx.fraud_probability * 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {tx.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(tx.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
