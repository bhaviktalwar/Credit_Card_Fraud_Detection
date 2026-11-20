import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { TransactionInputData, PredictionResult, BatchPredictionResult } from '../types';

// Default realistic sample for quick demo
const DEFAULT_SAMPLE: TransactionInputData = {
  Time: 406.0,
  Amount: 149.62,
  V1: -2.312226542,
  V2: 1.951992011,
  V3: -1.609850732,
  V4: 3.997905588,
  V5: -0.522187865,
  V6: -1.426545319,
  V7: -2.537387304,
  V8: 1.391657248,
  V9: -2.770089277,
  V10: -2.772272145,
  V11: 3.202033207,
  V12: -2.899907388,
  V13: -0.595221881,
  V14: -4.289253782, // Strong negative indicator typical in fraudulent transactions
  V15: 0.38972412,
  V16: -1.14074718,
  V17: -2.830055675,
  V18: -0.016822468,
  V19: 0.416955705,
  V20: 0.126910559,
  V21: 0.517232371,
  V22: -0.035049369,
  V23: -0.465211076,
  V24: 0.320198199,
  V25: 0.044519167,
  V26: 0.177839798,
  V27: 0.261145003,
  V28: -0.143275875
};

const GENUINE_SAMPLE: TransactionInputData = {
  Time: 120.0,
  Amount: 25.50,
  V1: 1.191857,
  V2: 0.266151,
  V3: 0.166480,
  V4: 0.448154,
  V5: 0.060018,
  V6: -0.082361,
  V7: -0.078803,
  V8: 0.085102,
  V9: -0.255425,
  V10: -0.166974,
  V11: 1.612727,
  V12: 1.065235,
  V13: 0.489028,
  V14: -0.143772,
  V15: 0.635558,
  V16: 0.463917,
  V17: -0.114805,
  V18: -0.183361,
  V19: -0.145783,
  V20: -0.069083,
  V21: -0.225775,
  V22: -0.638672,
  V23: 0.101288,
  V24: -0.339846,
  V25: 0.167170,
  V26: 0.125895,
  V27: -0.008983,
  V28: 0.014724
};

export const DetectPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'batch'>('individual');
  const [formData, setFormData] = useState<TransactionInputData>(GENUINE_SAMPLE);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Batch states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchPredictionResult | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);

  const handleInputChange = (field: keyof TransactionInputData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handlePredictSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await api.predictSingle(formData);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || 'Inference failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.csv')) {
        setBatchError('Please select a valid .csv file');
        return;
      }
      setSelectedFile(file);
      setBatchError(null);
    }
  };

  const handleBatchPredict = async () => {
    if (!selectedFile) return;
    setBatchLoading(true);
    setBatchError(null);
    try {
      const res = await api.predictBatch(selectedFile);
      setBatchResult(res);
    } catch (err: any) {
      setBatchError(err.message || 'Batch prediction failed');
    } finally {
      setBatchLoading(false);
    }
  };

  const downloadBatchCSV = () => {
    if (!batchResult) return;
    const headers = ['ID', 'Prediction', 'Label', 'Fraud_Probability', 'Threshold', 'Risk_Level', 'Amount', 'Time'];
    const rows = batchResult.predictions.map(p => [
      p.id,
      p.prediction,
      p.prediction_label,
      p.fraud_probability,
      p.threshold,
      p.risk_level,
      p.amount,
      p.transaction_time
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FraudGuard_Batch_${batchResult.summary.batch_id.substring(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSampleTemplate = () => {
    const cols = ['Time', ...Array.from({ length: 28 }, (_, i) => `V${i + 1}`), 'Amount'];
    const row1 = [GENUINE_SAMPLE.Time, ...Array.from({ length: 28 }, (_, i) => GENUINE_SAMPLE[`V${i + 1}` as keyof TransactionInputData]), GENUINE_SAMPLE.Amount];
    const row2 = [DEFAULT_SAMPLE.Time, ...Array.from({ length: 28 }, (_, i) => DEFAULT_SAMPLE[`V${i + 1}` as keyof TransactionInputData]), DEFAULT_SAMPLE.Amount];
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [cols.join(','), row1.join(','), row2.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sample_fraud_batch_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Transaction Risk Assessment
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Perform high-precision XGBoost inference on individual credit card transactions or batch CSV files.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('individual')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'individual'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Individual Transaction Scoring
        </button>

        <button
          onClick={() => setActiveTab('batch')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'batch'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Batch CSV Prediction
        </button>
      </div>

      {/* TAB 1: INDIVIDUAL PREDICTION */}
      {activeTab === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Form Inputs */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Input Feature Vectors</h3>
                <p className="text-xs text-slate-500">Provide the 30 features matching the model training specification.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(GENUINE_SAMPLE)}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Load Genuine Sample
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(DEFAULT_SAMPLE)}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-200"
                >
                  Load High-Risk Sample
                </button>
              </div>
            </div>

            <form onSubmit={handlePredictSingle} className="space-y-6">
              {/* Primary Key Features: Time & Amount */}
              <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Primary Transaction Data
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Transaction Amount ($ / €)
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={formData.Amount}
                      onChange={(e) => handleInputChange('Amount', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Time Elapsed (Seconds)
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.Time}
                      onChange={(e) => handleInputChange('Time', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* PCA Latent Features: V1 - V28 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Anonymized PCA Components (V1 to V28)
                  </h4>
                  <span className="text-xs text-slate-500">Transformed Numerical Space</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 max-h-96 overflow-y-auto p-1">
                  {Array.from({ length: 28 }, (_, i) => {
                    const key = `V${i + 1}` as keyof TransactionInputData;
                    const isSensitive = ['V14', 'V12', 'V17', 'V4', 'V10'].includes(key);
                    return (
                      <div key={key} className="space-y-1">
                        <label className={`block text-[11px] font-mono font-medium ${isSensitive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500'}`}>
                          {key} {isSensitive && '*'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={formData[key]}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className={`w-full px-2 py-1.5 text-xs font-mono rounded border ${
                            isSensitive 
                              ? 'border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20' 
                              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                          } text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500`}
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">* Features V14, V12, V17, V4, V10 have highest model gain weights.</p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing XGBoost Inference...
                  </>
                ) : (
                  <>
                    Run Fraud Detection
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right 1 Col: Live Result Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 border-2 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Real-Time Inference Output
              </h3>

              {prediction ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl text-center border ${
                    prediction.prediction === 1
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {prediction.prediction === 1 ? (
                      <ShieldAlert className="w-12 h-12 mx-auto text-red-500 mb-2 animate-bounce" />
                    ) : (
                      <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                    )}
                    <div className="text-xl font-extrabold uppercase tracking-wide">
                      {prediction.prediction_label}
                    </div>
                    <div className="text-xs font-medium mt-1">
                      Risk Tier: <span className="font-bold">{prediction.risk_level}</span>
                    </div>
                  </div>

                  {/* Probability Meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Fraud Probability Score</span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">
                        {(prediction.fraud_probability * 100).toFixed(4)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-500 ${
                          prediction.prediction === 1 ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(5, Math.min(100, prediction.fraud_probability * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Threshold: τ = {prediction.threshold.toFixed(2)}</span>
                      <span>{prediction.fraud_probability >= prediction.threshold ? 'Above Threshold' : 'Below Threshold'}</span>
                    </div>
                  </div>

                  {/* Metadata List */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction ID:</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                        {prediction.id.substring(0, 13)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Evaluated:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ${prediction.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Persistence:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Stored in DB
                      </span>
                    </div>
                  </div>

                  {/* Explanation text */}
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Interpretation:</strong> The model outputs a probability of fraud. Since {prediction.fraud_probability.toFixed(4)} is {prediction.prediction === 1 ? 'greater than or equal to' : 'less than'} the optimal threshold {prediction.threshold.toFixed(2)}, this transaction was classified as <strong>{prediction.prediction_label}</strong>.
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Layers className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs">
                    Configure feature values on the left and submit to receive instant model decision.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH CSV PREDICTION */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Batch CSV Fraud Screening</h3>
                <p className="text-xs text-slate-500">Upload a CSV dataset containing Time, V1 to V28, and Amount.</p>
              </div>
              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV Sample Template
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="mt-6">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                <UploadCloud className="w-12 h-12 text-brand-500 mb-3" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'Select or drag and drop a transaction CSV file'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Expected schema: 30 columns (Time, V1..V28, Amount). Max 5,000 rows per batch.
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {batchError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{batchError}</span>
              </div>
            )}

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to process: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={handleBatchPredict}
                  disabled={batchLoading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {batchLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Screening Batch...
                    </>
                  ) : (
                    <>
                      Run Batch Prediction
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Batch Results View */}
          {batchResult && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Batch Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4">
                  <div className="text-xs text-slate-500 font-semibold">TOTAL RECORDS</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {batchResult.summary.total_records.toLocaleString()}
                  </div>
                </div>

                <div className="glass-card p-4 border-l-4 border-l-red-500">
                  <div className="text-xs text-slate-500 font-semibold">DETECTED FRAUD</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {batchResult.summary.fraud_count}
                  </div>
                </div>

                <div className="glass-card p-4 border-l-4 border-l-emerald-500">
                  <div className="text-xs text-slate-500 font-semibold">CONFIRMED GENUINE</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {batchResult.summary.genuine_count}
                  </div>
                </div>

                <div className="glass-card p-4">
                  <div className="text-xs text-slate-500 font-semibold">BATCH FRAUD RATE</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {batchResult.summary.fraud_rate_pct}%
                  </div>
                </div>
              </div>

              {/* Table of Batch Predictions */}
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Batch Predictions ({batchResult.predictions.length} rows)
                  </h4>
                  <button
                    onClick={downloadBatchCSV}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Labeled CSV
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 sticky top-0 font-semibold uppercase">
                      <tr>
                        <th className="py-2.5 px-4">#</th>
                        <th className="py-2.5 px-4">Prediction</th>
                        <th className="py-2.5 px-4">Fraud Probability</th>
                        <th className="py-2.5 px-4">Risk Level</th>
                        <th className="py-2.5 px-4">Amount</th>
                        <th className="py-2.5 px-4">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {batchResult.predictions.slice(0, 100).map((row, idx) => {
                        const isFraud = row.prediction === 1;
                        return (
                          <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                isFraud ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              }`}>
                                {row.prediction_label}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-mono">
                              {(row.fraud_probability * 100).toFixed(4)}%
                            </td>
                            <td className="py-2.5 px-4 font-semibold">{row.risk_level}</td>
                            <td className="py-2.5 px-4">${row.amount.toFixed(2)}</td>
                            <td className="py-2.5 px-4 text-slate-500">{row.transaction_time}s</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
