import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  FileSpreadsheet, 
  Lock, 
  Zap, 
  Layers,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const modelHighlights = [
    { label: 'Evaluation F1-Score', value: '0.8289', sub: 'Highest balance of precision & recall', tag: 'Best in Project' },
    { label: 'Fraud Catch Recall', value: '76.76%', sub: 'Identifies 109 of 142 frauds in test', tag: 'XGBoost Final' },
    { label: 'Precision Accuracy', value: '90.08%', sub: 'Only 12 false positives across 85,118 test tx', tag: 'High Reliability' },
    { label: 'ROC-AUC Curve', value: '0.9634', sub: 'Consistent probabilistic ranking', tag: 'Validated' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Inference Engine',
      description: 'Scores single credit card transactions with microsecond latency using pre-compiled XGBoost booster weights.'
    },
    {
      icon: FileSpreadsheet,
      title: 'High-Throughput Batch CSV',
      description: 'Ingest enterprise transaction batches with automatic schema validation, feature ordering, and summary reports.'
    },
    {
      icon: Layers,
      title: 'SMOTE Imbalance Resilience',
      description: 'Trained with Synthetic Minority Over-sampling strictly on training folds to prevent real-world data leakage.'
    },
    {
      icon: Lock,
      title: 'Optimized Operating Threshold',
      description: 'Custom decision threshold (τ = 0.9) calibrated on validation sets to maximize true detections while minimizing customer friction.'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-500/10 via-brand-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400"
          >
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            Full-Stack AI/ML Credit Card Fraud Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Detect Banking Fraud with <span className="bg-gradient-to-r from-brand-600 to-indigo-400 bg-clip-text text-transparent">Precision Machine Learning</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Trained and calibrated on 284,807 European transactions. Powered by validated XGBoost, 
            SMOTE class balancing, and threshold calibration for real-world financial risk management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/detect"
              className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center gap-2 group transition-all"
            >
              Start Fraud Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
            >
              Explore Live Dashboard
            </Link>
          </motion.div>
        </div>

        {/* Interactive Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {modelHighlights.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-5 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition-all duration-300 relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {stat.tag}
                </span>
                <TrendingUp className="w-4 h-4 text-brand-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.sub}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Interactive Platform Architecture Preview */}
      <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
              Robust Pipeline
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Engineered for Enterprise Financial Defense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="glass-card p-6 bg-white dark:bg-slate-900/80 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
              End-to-End Workflow
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              From Raw Transaction to Instant Risk Assessment
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Every incoming transaction passes through strict schema validation and feature alignment 
              before reaching the optimized XGBoost classifier. Predictions are calibrated with an F1-optimal 
              operating threshold (0.90) to maintain high recall while avoiding costly false alarms.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Strict 30-Feature Schema Validation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Time, PCA components V1 to V28, and Amount mapped directly to model weights.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Deterministic Inference & Persistence</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">All predictions are securely logged in PostgreSQL / SQLite for historical compliance and audit trails.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Transparent Risk Scoring</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Provides exact fraud probabilities, risk tier classification, and feature contribution transparency.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/methodology"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500"
              >
                Read full machine learning methodology <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Graphical Pipeline Box */}
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-800 bg-gradient-to-tr from-white to-slate-50 dark:from-navy-900 dark:to-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500">
              <span>Pipeline: transaction_pipeline.py</span>
              <span className="text-emerald-500 font-semibold">Status: Ready</span>
            </div>

            <div className="space-y-4 py-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-brand-500 font-bold">1. Input Ingestion</span>: {`{ Time: 0.0, V1..V28: float, Amount: 149.62 }`}
              </div>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-indigo-500 font-bold">2. Serialization Check</span>: Model & Threshold loaded from Models/xgboost_model.pkl
              </div>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-amber-500 font-bold">3. Inference Prob</span>: <code className="text-emerald-600 dark:text-emerald-400">P(Fraud) = 0.000953</code>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
                4. Decision: 0.000953 &lt; 0.9000 &rarr; Label: GENUINE (Low Risk)
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/detect"
                className="w-full inline-block py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition-colors"
              >
                Test with Custom Inputs Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-3xl font-extrabold">Ready to evaluate transactions?</h2>
          <p className="text-indigo-100 text-base max-w-xl mx-auto">
            Test the live XGBoost model with your own test data or upload CSV batches for instant threat assessment.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/detect"
              className="px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm shadow hover:bg-indigo-50 transition-colors"
            >
              Analyze Transaction
            </Link>
            <Link
              to="/metrics"
              className="px-6 py-3 rounded-xl bg-brand-800/80 text-white font-semibold text-sm border border-brand-400/40 hover:bg-brand-900 transition-colors"
            >
              View Model Metrics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
