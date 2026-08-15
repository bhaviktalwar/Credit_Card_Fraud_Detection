# 💳 Credit Card Fraud Detection System

A machine learning-based **Credit Card Fraud Detection System** designed to identify fraudulent transactions from historical transaction data. The project compares multiple machine learning models and selects the best-performing model for fraud prediction.

The final system is designed to support real-time fraud prediction through a backend API and a user-friendly frontend interface.

---

## 📌 Project Overview

Credit card fraud is a major challenge in digital payments. Traditional rule-based systems can struggle to identify new and complex fraud patterns.

This project uses **Machine Learning** to classify credit card transactions as:

* `0` → Genuine Transaction
* `1` → Fraudulent Transaction

The project focuses on handling the highly **imbalanced nature of fraud datasets**, where fraudulent transactions represent only a small percentage of all transactions.

---

## 🎯 Objectives

* Detect fraudulent credit card transactions using Machine Learning.
* Perform exploratory data analysis on transaction data.
* Preprocess and prepare the dataset for model training.
* Handle class imbalance using **SMOTE**.
* Train and compare multiple machine learning models.
* Evaluate models using fraud-focused performance metrics.
* Perform threshold analysis for the selected model.
* Save the trained model and preprocessing components for deployment.
* Provide a foundation for a real-time fraud detection application.

---

## 🏗️ Project Workflow

```text
Raw Dataset
     │
     ▼
Exploratory Data Analysis
     │
     ▼
Data Preprocessing
     │
     ▼
Train/Test Split
     │
     ▼
Class Imbalance Handling
     │
     └── SMOTE
     │
     ▼
Model Training
     │
     ├── Logistic Regression
     ├── Random Forest
     ├── XGBoost
     └── LightGBM
     │
     ▼
Model Comparison
     │
     ▼
Random Forest Selected
     │
     ▼
Threshold Analysis
     │
     ▼
Final Model + Preprocessing Artifacts
     │
     ▼
Backend API
     │
     ▼
Frontend Application
```

---

## 📂 Project Structure

```text
Credit_Card_Fraud_Detection/
│
├── EDA/
│   ├── 01_Data_Understanding_and_EDA.ipynb
│   └── 02_Data_Preprocessing.ipynb
│
├── Models/
│   ├── 03_Logistic_Regression.ipynb
│   ├── 04_Random_Forest.ipynb
│   ├── 05_XGBoost.ipynb
│   ├── 06_LightGBM.ipynb
│   │
│   ├── feature_columns.pkl
│   ├── random_forest_smote.pkl
│   ├── random_forest_threshold.pkl
│   └── scaler.pkl
│
├── README.md
├── requirements.txt
└── .gitignore
```

> Dataset files are excluded from Git tracking using `.gitignore`.

---

# 🔎 Exploratory Data Analysis

The EDA stage focuses on understanding the structure and characteristics of the dataset.

Major activities include:

* Understanding dataset dimensions.
* Checking data types.
* Identifying missing values.
* Checking duplicate records.
* Understanding transaction amount distribution.
* Analysing fraudulent vs genuine transactions.
* Studying feature distributions.
* Understanding class imbalance.
* Identifying relationships and patterns in transaction features.

The dataset contains anonymized transaction features such as:

```text
Time
V1
V2
V3
...
V28
Amount
Class
```

Where:

* `Time` represents the transaction time.
* `V1`–`V28` are anonymized numerical transaction features.
* `Amount` represents the transaction amount.
* `Class` is the target variable.

---

# ⚙️ Data Preprocessing

Before training the models, the dataset is processed to make it suitable for Machine Learning.

The preprocessing pipeline includes:

1. Separating input features and target variable.
2. Splitting the dataset into training and testing sets.
3. Feature scaling where required.
4. Handling class imbalance using SMOTE.
5. Maintaining the correct feature order for prediction.

### Class Imbalance

Fraud detection datasets are generally highly imbalanced because genuine transactions significantly outnumber fraudulent transactions.

Training a model directly on such data can cause the model to favour the majority class.

To address this, **SMOTE (Synthetic Minority Over-sampling Technique)** is applied to the training data.

SMOTE generates synthetic minority-class examples to improve the model's ability to identify fraudulent transactions.

---

# 🤖 Machine Learning Models

Four machine learning models were trained and evaluated.

## 1. Logistic Regression

Logistic Regression provides a simple and interpretable baseline classification model.

It estimates the probability that a transaction belongs to the fraud class.

---

## 2. Random Forest

Random Forest is an ensemble learning algorithm based on multiple decision trees.

It was evaluated for its ability to capture non-linear relationships and handle complex transaction patterns.

---

## 3. XGBoost

XGBoost is a gradient boosting algorithm that builds an ensemble of decision trees sequentially.

It is widely used for structured/tabular datasets and classification problems.

---

## 4. LightGBM

LightGBM is another gradient boosting framework designed for efficient and high-performance training on large tabular datasets.

---

# 📊 Model Evaluation

The models are compared using classification metrics relevant to fraud detection.

Important metrics include:

### Accuracy

Measures the overall percentage of correctly classified transactions.

However, accuracy alone is not sufficient for fraud detection because the dataset is highly imbalanced.

### Precision

Precision answers:

> "Of all transactions predicted as fraud, how many were actually fraud?"

High precision reduces false fraud alerts.

### Recall

Recall answers:

> "Of all actual fraudulent transactions, how many did the model successfully detect?"

For fraud detection, recall is particularly important because missing an actual fraudulent transaction can be costly.

### F1-Score

F1-score balances precision and recall.

```text
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

### Confusion Matrix

The confusion matrix contains:

```text
                 Predicted
               Genuine  Fraud
Actual Genuine    TN      FP
Actual Fraud      FN      TP
```

Where:

* `TP` = Fraud correctly detected
* `TN` = Genuine correctly detected
* `FP` = Genuine incorrectly classified as fraud
* `FN` = Fraud incorrectly classified as genuine

---

# 🏆 Model Selection

After comparing the four trained models, **Random Forest was selected as the final model** based on its overall performance for the fraud detection task.

The selected Random Forest model was trained using the SMOTE-balanced training data.

```text
Logistic Regression
        │
Random Forest  ← Selected
        │
     XGBoost
        │
     LightGBM
```

The final deployment pipeline therefore focuses on the Random Forest model and its associated preprocessing components.

---

# 🎚️ Threshold Analysis

Machine learning classifiers generally produce a probability score representing how likely a transaction is to belong to the fraud class.

Instead of always using the default classification threshold of `0.5`, different thresholds can be evaluated.

For example:

```text
Probability >= threshold → Fraud
Probability < threshold  → Genuine
```

The threshold can affect the balance between:

* Precision
* Recall
* False Positives
* False Negatives

For fraud detection, threshold selection is important because the cost of missing fraud can be significantly different from the cost of generating a false alert.

The final Random Forest model therefore includes threshold analysis to determine an appropriate decision boundary.

---

# 💾 Saved Model Artifacts

The final system stores important trained components as `.pkl` files.

### `random_forest_smote.pkl`

Contains the trained Random Forest model after training using the SMOTE-balanced dataset.

### `random_forest_threshold.pkl`

Stores the selected threshold/configuration used to convert the model's probability output into a fraud/genuine prediction.

### `scaler.pkl`

Stores the feature-scaling object used during preprocessing.

The same scaler must be applied to incoming transactions before prediction.

### `feature_columns.pkl`

Stores the expected feature names/order used by the trained model.

This helps ensure that incoming data is provided to the model in the correct feature order.

---

# 🔄 Prediction Pipeline

When a new transaction is received, the prediction pipeline follows:

```text
New Transaction
      │
      ▼
Validate Input Features
      │
      ▼
Arrange Features in Correct Order
      │
      ▼
Load scaler.pkl
      │
      ▼
Scale Input
      │
      ▼
Load random_forest_smote.pkl
      │
      ▼
Generate Fraud Probability
      │
      ▼
Apply Selected Threshold
      │
      ▼
Fraud / Genuine
```

Example:

```text
Transaction
     ↓
Probability = 0.82
     ↓
Threshold = 0.30
     ↓
0.82 >= 0.30
     ↓
FRAUD
```

---

# 🖥️ Planned Application Architecture

The machine learning component can be integrated into a full-stack application.

```text
                ┌───────────────┐
                │    Frontend   │
                │  Web Interface│
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │    Backend    │
                │   REST API    │
                └───────┬───────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ ML Prediction Service│
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Random Forest Model  │
             │ + Scaler + Threshold │
             └──────────────────────┘
```

The frontend can allow users to enter transaction information and receive a prediction such as:

```text
Prediction: FRAUD
Fraud Probability: 87.4%
```

or:

```text
Prediction: GENUINE
Fraud Probability: 8.2%
```

---

# 🛠️ Technologies Used

### Programming Language

* Python

### Machine Learning

* Scikit-learn
* Random Forest
* Logistic Regression
* XGBoost
* LightGBM

### Data Processing

* Pandas
* NumPy

### Data Visualization

* Matplotlib
* Seaborn

### Imbalanced Data Handling

* imbalanced-learn
* SMOTE

### Model Serialization

* Joblib / Pickle

### Version Control

* Git
* GitHub

### Planned Application Layer

* Backend REST API
* Frontend Web Application

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/bhaviktalwar/Credit_Card_Fraud_Detection.git
```

Move into the project:

```bash
cd Credit_Card_Fraud_Detection
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# ▶️ Running the Project

The notebooks can be opened and executed using Jupyter Notebook or VS Code.

Example:

```bash
jupyter notebook
```

The workflow can be followed in this order:

```text
1. Data Understanding & EDA
2. Data Preprocessing
3. Logistic Regression
4. Random Forest
5. XGBoost
6. LightGBM
7. Model Comparison
8. Random Forest Selection
9. Threshold Analysis
```

---

# 👥 Team Contributions

| Member            | Contribution                                                 |
| ----------------- | ------------------------------------------------------------ |
| **Bhavik Talwar** | EDA, Data Preprocessing, Random Forest, SMOTE model artifact |
| **Hardika**       | Logistic Regression, Random Forest threshold artifact        |
| **Gauravi**       | XGBoost, scaler artifact                                     |
| **Harsimrat**     | LightGBM, feature-column artifact                            |

---

# 🌿 Git Branch Strategy

The project uses separate branches for team members:

```text
main
│
├── bhavik
├── hardika
├── gauravi
└── harsimrat
```

Each member works on their respective branch and changes are merged into `main` after review.

---

# 🔐 Data & Model Files

The original dataset is not included in the repository and is excluded through `.gitignore`.

The trained model artifacts required for the prediction pipeline are maintained separately:

```text
random_forest_smote.pkl
random_forest_threshold.pkl
scaler.pkl
feature_columns.pkl
```

---

# 🚀 Future Enhancements

* Real-time fraud prediction through REST API.
* Interactive frontend dashboard.
* Transaction prediction history.
* Fraud probability visualization.
* Model performance dashboard.
* Authentication and user management.
* Database integration.
* Deployment using cloud infrastructure.
* Monitoring model predictions and performance.
* Automated model retraining with new transaction data.

---

# ⚠️ Disclaimer

This project is developed for **educational and research purposes**.

The predictions generated by the model should not be considered a definitive determination of whether a financial transaction is fraudulent. A production fraud detection system would require additional security, monitoring, validation, and domain-specific controls.

---

## ⭐ Conclusion

The project demonstrates an end-to-end Machine Learning workflow for credit card fraud detection, including:

```text
EDA
 ↓
Preprocessing
 ↓
SMOTE
 ↓
Multiple Model Training
 ↓
Model Comparison
 ↓
Random Forest Selection
 ↓
Threshold Analysis
 ↓
Model Serialization
 ↓
Backend Integration
 ↓
Frontend Application
```

The final system provides a foundation for building a practical, deployable **Credit Card Fraud Detection System**.
