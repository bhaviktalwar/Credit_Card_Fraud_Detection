# FraudGuard AI — Full-Stack Credit Card Fraud Detection Web Application

FraudGuard AI is an enterprise-grade full-stack machine learning web application built around an existing, trained **XGBoost** fraud detection pipeline. The model was trained and evaluated on 284,807 European cardholder transactions, addressing severe class imbalance (0.172% fraud) with **SMOTE** on training data only and custom validation-based decision threshold calibration (**τ = 0.90**).

---

## 1. System Architecture

```
Credit_Card_Fraud_Detection/
├── backend/                       # Python FastAPI REST API Backend
│   ├── app/
│   │   ├── api/routes/            # API Endpoints (/predict, /predict/batch, /dashboard, etc.)
│   │   ├── core/                  # App configurations, settings, CORS
│   │   ├── database/              # SQLAlchemy session and engine (PostgreSQL / SQLite)
│   │   ├── models/                # Database ORM models (TransactionPrediction)
│   │   ├── schemas/               # Pydantic schemas (Validation & Serialization)
│   │   ├── services/              # ML inference (xgboost_model.pkl) & business logic
│   │   └── main.py                # FastAPI initialization & Lifespan handler
│   ├── tests/                     # Automated unit and integration tests
│   ├── requirements.txt           # Backend Python dependencies
│   ├── .env                       # Environment configuration
│   └── .env.example
│
├── frontend/                      # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/            # UI components (Navbar, Footer, Layouts)
│   │   ├── context/               # ThemeContext (Smooth Dark / Light Mode)
│   │   ├── pages/                 # Landing, Dashboard, Detect, History, Metrics, Methodology
│   │   ├── services/              # Centralized typed API service (fetch client)
│   │   └── types/                 # TypeScript interfaces for API and data models
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── Credit_Card_Fraud_Detection/   # ORIGINAL MACHINE LEARNING PROJECT (STRICTLY PRESERVED)
│   ├── EDA/                       # Exploratory Data Analysis & Preprocessing notebooks
│   ├── Models/                    # Serialized models:
│   │   ├── xgboost_model.pkl      # Trained XGBoost Classifier
│   │   ├── xgboost_threshold.pkl  # Calibrated decision threshold (0.90)
│   │   ├── feature_columns.pkl    # 30 Ordered features (Time, V1..V28, Amount)
│   │   └── scaler.pkl             # Scaler metadata
│   └── README.md                  # Original ML Documentation (Untouched)
│
└── APP_README.md                  # Complete Web Application Setup Guide
```

---

## 2. Key Features

- **Real-Time Single Transaction Scoring:** Enter the exact 30 features (Time, V1..V28, Amount) with preset samples (genuine / fraudulent) to receive real-time fraud probabilities, risk tier classification, and threshold verification.
- **Batch CSV Analysis:** Upload CSV files (up to 5,000 transactions at a time) for fast batch inference, summary rate statistics, and downloadable prediction CSVs.
- **Analytics Dashboard:** Real-time visual metrics powered by actual database records: total transactions analyzed, fraud detection rate, risk tier distributions, class ratios, and recent activity.
- **Historical Audit Trail:** Searchable, filterable, and paginated record of all predictions stored in the database with modal inspection of feature vectors.
- **Model Intelligence & Evaluation:** Documented benchmarks of all 4 candidate models (Logistic Regression, Random Forest, LightGBM, and XGBoost), threshold optimization curves, confusion matrix, and feature gain rankings.
- **Data Science Methodology:** Complete pedagogical walkthrough of the 8-stage ML lifecycle, explaining the accuracy paradox, SMOTE leakage prevention, and trade-offs between precision and recall.
- **Modern UI/UX:** Responsive layouts for mobile/desktop, fluid animations with Framer Motion, and synchronized Light/Dark mode toggling.

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Framer Motion
- **Backend:** Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn
- **Machine Learning:** Serialized XGBoost model (`xgboost_model.pkl`), NumPy, Pandas, Scikit-learn
- **Database:** PostgreSQL (production) with automated local SQLite fallback (`sqlite:///./fraud_detection.db`)

---

## 4. Setup and Installation

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Verify or modify `.env` as needed:
   ```env
   PROJECT_NAME="FraudGuard AI"
   ENVIRONMENT="development"
   DEBUG=True
   DATABASE_URL="sqlite:///./fraud_detection.db"
   # To use PostgreSQL:
   # DATABASE_URL="postgresql://user:password@localhost:5432/fraud_db"
   MODEL_DIR="../Credit_Card_Fraud_Detection/Models"
   ```

5. Start the backend server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The API and Swagger docs will be accessible at: `http://localhost:8000/docs`*

---

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The web application will be accessible at: `http://localhost:5173`*

4. Build for production:
   ```bash
   npm run build
   ```

---

## 5. API Reference

| Endpoint | Method | Description |
|---|---|---|
| `GET /api/health` | GET | Health status, model readiness, threshold, and feature count |
| `POST /api/predict` | POST | Scores a single transaction (requires 30 features) and records prediction |
| `POST /api/predict/batch` | POST | Uploads and screens a CSV batch with summary statistics |
| `GET /api/dashboard/stats` | GET | Aggregated live database statistics and risk distributions |
| `GET /api/transactions` | GET | Paginated list of predictions with search and filters |
| `GET /api/transactions/{id}` | GET | Full metadata and feature vector of a specific prediction |
| `GET /api/model/metrics` | GET | Authentic evaluation metrics, confusion matrix, and feature importances |

---

## 6. Model Verification & Safety Notes

- **Preservation of Artifacts:** The original machine learning artifacts in `Credit_Card_Fraud_Detection/Models/` were left completely intact and unmodified.
- **Inference Pipeline:** The backend strictly enforces the exact feature ordering defined in `feature_columns.pkl` before passing input vectors to `xgboost_model.pkl`.
- **Threshold Calibration:** Predictions compare the model probability against `xgboost_threshold.pkl` (τ = 0.90) to classify transactions as **Genuine** (0) or **Fraudulent** (1).
