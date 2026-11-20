import React from 'react';
import { 
  BookOpen, 
  GitBranch, 
  Database, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MethodologyPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Dataset Understanding & EDA',
      desc: 'The project investigates 284,807 European credit card transactions across 2 days in September 2013. Only 492 transactions (0.172%) are fraudulent, exposing an extreme 578:1 class imbalance where conventional accuracy is meaningless.'
    },
    {
      num: '02',
      title: 'Data Preprocessing & Hygiene',
      desc: 'Duplicate records were removed without modifying the raw source CSV. The dataset contains 30 input features: Time, 28 PCA-transformed numerical features (V1 to V28), and transaction Amount.'
    },
    {
      num: '03',
      title: 'Stratified Train-Test Splitting',
      desc: 'An 80/20 train/test split was performed using stratification on the Class label. This guarantees that the holdout test set (85,118 samples with 142 fraud cases) remains untouched and representative of real-world class distributions.'
    },
    {
      num: '04',
      title: 'SMOTE Class Imbalance Handling',
      desc: 'Synthetic Minority Over-sampling Technique (SMOTE) was strictly applied to the training set only. Synthesizing minority fraud cases exclusively in training avoids catastrophic data leakage into validation or testing sets.'
    },
    {
      num: '05',
      title: 'Multi-Model Benchmark & Evaluation',
      desc: 'Four diverse classification paradigms were trained: Logistic Regression (linear baseline), Random Forest (bagging ensemble), LightGBM (histogram boosting), and XGBoost (extreme gradient boosting).'
    },
    {
      num: '06',
      title: 'Validation-Based Threshold Optimization',
      desc: 'Instead of accepting an arbitrary 0.5 default decision threshold, thresholds from 0.1 to 0.9 were swept across an internal validation fold. XGBoost achieved maximum validation F1-score (0.8480) at threshold τ = 0.90.'
    },
    {
      num: '07',
      title: 'Final Model Selection (XGBoost)',
      desc: 'XGBoost achieved the highest F1-score (0.8289) on the untouched test set, striking the optimal operational trade-off between intercepting fraud (76.76% recall) and suppressing costly false alerts (90.08% precision).'
    },
    {
      num: '08',
      title: 'Full-Stack Application Integration',
      desc: 'The serialized XGBoost model, threshold artifact, and feature definitions were encapsulated in a high-performance FastAPI service with PostgreSQL persistence and a reactive TypeScript dashboard.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Engineering Architecture & Science
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Machine Learning Methodology
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Detailed breakdown of the data science lifecycle, leakage prevention strategies, and decision criteria 
          documented in the original project research.
        </p>
      </div>

      {/* Dataset Specification Card */}
      <div className="glass-card p-6 border-l-4 border-l-brand-500">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Dataset Architecture & Specifications
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
          The dataset was sourced from the benchmark Kaggle European Cardholders dataset. Due to confidentiality, 
          features V1 through V28 are the principal components obtained via PCA. The only non-transformed features 
          are <strong>Time</strong> (seconds elapsed since first transaction) and <strong>Amount</strong>. 
          The target variable <strong>Class</strong> is binary (0 for genuine, 1 for fraudulent).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500">Total Transactions:</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">284,807</p>
          </div>
          <div>
            <span className="text-slate-500">Fraudulent Rate:</span>
            <p className="font-bold text-red-600 dark:text-red-400 text-sm mt-0.5">0.172% (492 cases)</p>
          </div>
          <div>
            <span className="text-slate-500">Input Feature Count:</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">30 Features</p>
          </div>
          <div>
            <span className="text-slate-500">Test Holdout Size:</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">85,118 (20%)</p>
          </div>
        </div>
      </div>

      {/* 8-Step Timeline */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          The 8-Stage Machine Learning Lifecycle
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass-card p-6 relative group hover:border-brand-500/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                  {step.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-brand-500 transition-colors" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive: Why Accuracy is Misleading */}
      <div className="glass-card p-6 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              The Accuracy Paradox in Financial Fraud Detection
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If an arbitrary model simply predicted "Genuine" for 100% of transactions, it would achieve 
              an astonishing <strong>99.83% accuracy</strong> while catching zero fraud and incurring millions in 
              financial liabilities. Therefore, this project strictly optimizes for <strong>Precision</strong>, 
              <strong>Recall</strong>, <strong>F1-Score</strong>, and <strong>PR-AUC</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Production Integration Card */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Experience the Integrated XGBoost Engine
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Test the live inference pipeline with custom transaction feature vectors or inspect the real-time analytics dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/detect"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow flex items-center gap-2 transition-colors"
          >
            Analyze Transaction <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/metrics"
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
          >
            Review Model Metrics
          </Link>
        </div>
      </div>
    </div>
  );
};
