import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  Sliders, 
  Info,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { api } from '../services/api';
import { ModelMetrics } from '../types';

export const MetricsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getModelMetrics()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading model evaluation metrics...</p>
      </div>
    );
  }

  // Format data for comparison chart
  const comparisonChartData = metrics.models_comparison.map(m => ({
    name: m.model,
    Precision: (m.precision * 100).toFixed(1),
    Recall: (m.recall * 100).toFixed(1),
    'F1-Score': (m.f1_score * 100).toFixed(1),
    'ROC-AUC': (m.roc_auc * 100).toFixed(1),
  }));

  const thresholdChartData = metrics.threshold_tuning_table.map(t => ({
    threshold: t.threshold.toFixed(1),
    Precision: (t.precision * 100).toFixed(1),
    Recall: (t.recall * 100).toFixed(1),
    'F1-Score': (t.f1_score * 100).toFixed(1)
  }));

  const { true_positive, false_positive, false_negative, true_negative } = metrics.confusion_matrix;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-2">
          <Award className="w-3.5 h-3.5" />
          Rigorous Evaluation on 85,118 Holdout Transactions
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Model Intelligence & Performance
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Comprehensive comparison of all 4 evaluated machine learning models and detailed justification 
          for selecting XGBoost based on optimal F1-score and validation threshold calibration.
        </p>
      </div>

      {/* Selected Model Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-900/60 via-slate-900 to-indigo-950 text-white border border-brand-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500 text-white uppercase tracking-wider">
                Production Selection
              </span>
              <span className="text-xs text-brand-300 font-mono">XGBClassifier (F1: 0.8289)</span>
            </div>
            <h2 className="text-2xl font-black">XGBoost Classifier with Threshold τ = 0.90</h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Selected because it achieves the highest F1-score across all 4 candidate models. In fraud detection, 
              accuracy is misleading due to severe imbalance (99.83% genuine). F1 measures the exact harmonic trade-off 
              between intercepting fraud and preventing false alerts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center shrink-0">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-emerald-400">90.08%</div>
              <div className="text-[11px] text-slate-300">Precision</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-brand-300">76.76%</div>
              <div className="text-[11px] text-slate-300">Recall</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-amber-300">0.8289</div>
              <div className="text-[11px] text-slate-300">F1-Score</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-indigo-300">0.9634</div>
              <div className="text-[11px] text-slate-300">ROC-AUC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Comparative Benchmark Across 4 Candidate Algorithms
          </h3>
          <p className="text-xs text-slate-500">Documented results on the untouched 20% test partition (85,118 transactions).</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Model Algorithm</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">F1-Score</th>
                <th className="py-3 px-4">ROC-AUC</th>
                <th className="py-3 px-4">PR-AUC</th>
                <th className="py-3 px-4">Status / Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              {metrics.models_comparison.map((m) => (
                <tr key={m.model} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${m.best ? 'bg-brand-50/40 dark:bg-brand-950/20 font-semibold' : ''}`}>
                  <td className="py-3 px-4 font-sans text-slate-900 dark:text-white flex items-center gap-2">
                    {m.best && <Award className="w-4 h-4 text-brand-500 shrink-0" />}
                    {m.model}
                  </td>
                  <td className="py-3 px-4">{m.precision.toFixed(4)}</td>
                  <td className="py-3 px-4">{m.recall.toFixed(4)}</td>
                  <td className="py-3 px-4 text-brand-600 dark:text-brand-400 font-bold">{m.f1_score.toFixed(4)}</td>
                  <td className="py-3 px-4">{m.roc_auc.toFixed(4)}</td>
                  <td className="py-3 px-4">{m.pr_auc.toFixed(4)}</td>
                  <td className="py-3 px-4 font-sans">
                    {m.best ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
                        Selected Final
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Evaluated Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Visual Chart */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Model Metric Comparison Breakdown (%)
        </h3>
        <p className="text-xs text-slate-500 mb-6">Interactive comparison of Precision, Recall, F1-Score, and ROC-AUC.</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Precision" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recall" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1-Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ROC-AUC" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row: Confusion Matrix + Threshold Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix Card */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Confusion Matrix on Test Set
              </h3>
              <p className="text-xs text-slate-500">Evaluated with decision threshold τ = 0.90.</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              N = 85,118
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center my-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">TRUE NEGATIVE (TN)</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {true_negative.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Genuine correctly cleared</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">FALSE POSITIVE (FP)</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {false_positive.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">False alarms (genuine flagged)</span>
            </div>

            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
              <span className="text-[11px] font-semibold text-red-800 dark:text-red-300">FALSE NEGATIVE (FN)</span>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
                {false_negative.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Fraud missed by model</span>
            </div>

            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900">
              <span className="text-[11px] font-semibold text-brand-800 dark:text-brand-300">TRUE POSITIVE (TP)</span>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
                {true_positive.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Fraud intercepted</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Out of 142 fraudulent transactions in the holdout set, XGBoost caught <strong>109</strong> (76.76% recall) while triggering only <strong>12</strong> false alerts out of 84,976 genuine transactions (90.08% precision).
          </p>
        </div>

        {/* Validation Threshold Tuning Curve */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Threshold Calibration Curve
              </h3>
              <p className="text-xs text-slate-500">Validation sweep finding optimal operating point.</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              Peak F1 at τ = 0.9
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={thresholdChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="threshold" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[20, 100]} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Precision" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Recall" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="F1-Score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            As the threshold rises from 0.1 to 0.9, Precision increases sharply from 25.69% to 89.83% on validation while Recall stays robust around 80.30%, yielding the highest overall F1 score (0.848 on validation, 0.8289 on test).
          </p>
        </div>
      </div>

      {/* Feature Gain Importance Section */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Top Model Feature Importances (Gain Weight)
        </h3>
        <p className="text-xs text-slate-500 mb-6">Features contributing highest predictive power inside trained XGBoost trees.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {metrics.feature_importances.map((item, idx) => (
            <div key={item.feature} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {item.feature}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                  {item.weight.toFixed(1)}%
                </span>
                <div className="text-[10px] text-slate-400">Gain: {item.importance}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
