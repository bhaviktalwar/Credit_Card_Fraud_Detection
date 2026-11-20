import React from 'react';
import { Shield, ExternalLink, GitBranch, Cpu, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-navy-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-500" />
              <span className="font-bold text-lg text-slate-900 dark:text-white">FraudGuard AI</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Full-Stack Artificial Intelligence and Machine Learning Credit Card Fraud Detection platform. 
              Powered by serialized XGBoost with SMOTE class imbalance handling and threshold optimization.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-brand-500" /> XGBoost Classifier (F1: 0.8289)
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-500" /> 284,807 Dataset Transactions
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/dashboard" className="hover:text-brand-500 transition-colors">Live Analytics Dashboard</Link></li>
              <li><Link to="/detect" className="hover:text-brand-500 transition-colors">Transaction Scoring & Batch CSV</Link></li>
              <li><Link to="/history" className="hover:text-brand-500 transition-colors">Audit & Prediction History</Link></li>
              <li><Link to="/metrics" className="hover:text-brand-500 transition-colors">Model Comparison Intelligence</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Methodology & Tech
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/methodology" className="hover:text-brand-500 transition-colors">SMOTE & Feature Engineering</Link></li>
              <li><span className="text-slate-400 dark:text-slate-500">FastAPI & Python 3.11</span></li>
              <li><span className="text-slate-400 dark:text-slate-500">React, TypeScript & Tailwind</span></li>
              <li><span className="text-slate-400 dark:text-slate-500">PostgreSQL / SQLite Storage</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} FraudGuard AI Platform. Evaluated on Kaggle European Cardholders Dataset.</p>
          <p className="mt-2 sm:mt-0 font-medium">Production-Grade AI/ML System</p>
        </div>
      </div>
    </footer>
  );
};
