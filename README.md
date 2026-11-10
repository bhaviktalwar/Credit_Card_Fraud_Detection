<div align="center">Credit Card Fraud Detection System
An end-to-end machine learning project for identifying fraudulent credit card transactions




</div>Project Overview
Credit card fraud detection is a challenging classification problem because fraudulent transactions represent only a very small fraction of all transactions. A model that simply favours genuine transactions may achieve high accuracy while failing to identify fraud.

This project develops and evaluates a machine learning workflow to distinguish between:
- 0 — Genuine transaction
- 1 — Fraudulent transaction
Four classification algorithms are implemented and compared: Logistic Regression, Random Forest, XGBoost, and LightGBM. The workflow combines exploratory data analysis, preprocessing, class-imbalance handling, model-specific threshold optimization, and performance evaluation.
Current model finding: XGBoost achieved the highest reported F1-score (0.8289), while Random Forest achieved the highest reported Precision (0.9643) and PR-AUC (0.8204). XGBoost is therefore the current F1-based model choice, subject to the evaluation caveat described below.

Key Highlights
- Analysis of a highly imbalanced real-world credit card transaction dataset.
- Exploratory analysis of transaction patterns, feature distributions, and class imbalance.
- SMOTE applied to training data only to reduce data leakage risk.
- Four machine learning models trained and evaluated.
- A consistent validation-based threshold-selection methodology applied across models.
- Model-specific best thresholds used for final test-set metric calculation.
- Evaluation using Precision, Recall, F1-score, ROC-AUC, and PR-AUC.
- Model artifacts prepared for a future prediction application.
Dataset
The project uses the public Credit Card Fraud Detection dataset available on Kaggle.
Attribute	Description
Transactions	284,807
Features	30 input features
Total columns	31, including the target
Target column	Class
Genuine class	0
Fraud class	1


Feature description
- Time — Time elapsed between the first transaction and the transaction.
- V1–`V28` — Anonymized numerical features already transformed using PCA in the source dataset.
- Amount — Transaction amount.
- Class — Target label indicating genuine or fraudulent activity.
The original dataset is not included in this repository. Download it from Kaggle and place creditcard.csv in Data/raw/.
Project Workflow
                 Credit Card Transaction Dataset
                              |
                              v
                  Exploratory Data Analysis
                              |
                              v
                      Data Preprocessing
                              |
                              v
                 Train / Validation / Test Split
                              |
                              v
                 SMOTE on Training Data Only
                              |
                              v
                       Model Training
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
        Logistic          Random           XGBoost
       Regression         Forest
                              |
                              v
                           LightGBM
                              |
                              v
                    Validation-Based Threshold
                          Optimization
                              |
                              v
                  Evaluation on Test Data
                              |
                              v
                     Model Comparison
                              |
                              v
                    Model Selection & Saving
                              |
                              v
                 Future Application Integration
Evaluation methodology
To maintain a consistent and leakage-aware evaluation process:
1. The dataset is divided into training, validation, and test sets.
2. SMOTE is applied only to the training data.
3. Each model is trained using the prepared training data.
4. The best classification threshold for each model is selected using validation data.
5. Each model's selected threshold is then used to calculate its final classification metrics on the untouched test set.
6. The models are compared using the same evaluation methodology.
Note: The optimal threshold is model-specific; it does not need to be numerically identical across models. The important point is that the threshold-selection procedure is consistent and uses validation data rather than the test set.
Exploratory Data Analysis
The EDA stage examines the dataset's structure and characteristics, including:
- Dataset dimensions, data types, and descriptive statistics.
- Missing values and duplicate records.
- Genuine versus fraudulent transaction distribution.
- Transaction amount and time distributions.
- Individual feature distributions.
- Correlation patterns among numerical features.
- Potential outliers and unusual transaction patterns.
These analyses help establish the dataset's characteristics and inform the preprocessing and modelling stages.
Data Preprocessing and Imbalance Handling
The preprocessing workflow includes:
1. Separating the input features and target variable.
2. Creating training, validation, and test datasets.
3. Applying feature scaling where required by a model.
4. Addressing class imbalance with SMOTE (Synthetic Minority Over-sampling Technique) on training data only.
5. Maintaining the feature names and order expected by the trained model.
SMOTE generates synthetic minority-class examples to help models learn patterns associated with fraudulent transactions. Validation and test sets retain their original class distribution so that evaluation better reflects the naturally imbalanced problem.

Tree-based models such as Random Forest, XGBoost, and LightGBM generally do not require standard feature scaling. The inference pipeline must nevertheless match the preprocessing actually used to train the selected model.
Models Implemented
Model	Role in the project
Logistic Regression	Baseline linear classification model
Random Forest	Tree-ensemble model for learning non-linear patterns
XGBoost	Gradient-boosted tree model for structured data
LightGBM	Efficient gradient-boosting model for tabular data


Model Performance
The following table summarizes the latest reported evaluation results.
Model	Precision	Recall	F1-score	ROC-AUC	PR-AUC
Logistic Regression	0.0503	0.8803	0.0952	0.9665	0.6913
Random Forest	0.9643	0.5704	0.7168	0.9669	0.8204
XGBoost	0.9008	0.7676	0.8289	0.9634	0.8004
LightGBM	0.9174	0.7042	0.7968	0.9599	0.7114


Interpreting the results
- XGBoost recorded the highest F1-score, indicating the strongest reported balance between Precision and Recall.
- Random Forest recorded the highest Precision, which means fewer false fraud alerts among its predicted fraud cases, and the highest PR-AUC.
- Logistic Regression achieved high Recall but substantially lower Precision and F1-score at its selected operating threshold.
- LightGBM delivered a strong Precision-Recall balance, although its reported F1-score was below XGBoost.
Evaluation metrics
- Precision: How many transactions predicted as fraud were actually fraudulent.
- Recall: How many actual fraudulent transactions were detected.
- F1-score: Harmonic mean of Precision and Recall.
- ROC-AUC: Measures ranking performance across classification thresholds.
- PR-AUC: Summarizes the Precision-Recall trade-off and is particularly useful for imbalanced classification.
Accuracy is not used as the sole selection criterion because the genuine class dominates the dataset.
Current Model Selection
XGBoost is the current selection when F1-score is the primary criterion.
Selection criterion	Best reported model	Score
F1-score	XGBoost	0.8289
Precision	Random Forest	0.9643
Recall	XGBoost	0.7676
ROC-AUC	Random Forest	0.9669
PR-AUC	Random Forest	0.8204


The selection reflects a trade-off between detecting fraudulent transactions and limiting false alerts. XGBoost is the F1-based choice in the current results; Random Forest remains a strong alternative when Precision or PR-AUC is prioritized.
Threshold Optimization
A classification model produces a probability score. A threshold converts that score into a class label:
Predicted probability >= selected threshold  -> Fraud
Predicted probability < selected threshold   -> Genuine
Rather than assuming that 0.5 is optimal for every classifier, the project selects a suitable threshold for each model using the validation set. The selected threshold is then used to evaluate that model on the test set.

This approach allows each model to operate at a suitable Precision-Recall trade-off while keeping the threshold-selection methodology consistent across models.
Saved Model Artifacts
The current XGBoost saving workflow includes:
File	Purpose
xgboost_model.pkl	Serialized trained XGBoost classifier
xgboost_threshold.pkl	Selected XGBoost classification threshold
feature_columns.pkl	Expected input feature names and order
scaler.pkl	Scaling object, if required by the relevant model pipeline


The model, threshold, feature order, and preprocessing steps must be kept consistent. In particular, do not apply scaler.pkl to XGBoost unless the saved model was trained using that scaling step.

Only load pickle files from trusted sources. Compatibility may depend on the Python and machine-learning library versions used to create the artifacts.
Intended Prediction Pipeline
The planned prediction flow for a new transaction is:
Incoming Transaction
        |
        v
Input Validation
        |
        v
Feature Ordering
        |
        v
Required Preprocessing
        |
        v
Load Trained XGBoost Model
        |
        v
Generate Fraud Probability
        |
        v
Apply Selected Threshold
        |
        v
Fraud / Genuine Result
The incoming data must contain the same input features in the same order and use the same preprocessing expected by the trained model.
Repository Structure
Credit_Card_Fraud_Detection/
│
├── Data/
│   ├── raw/
│   │   └── creditcard.csv
│   └── processed/
│       ├── X_train.csv
│       ├── X_test.csv
│       ├── y_train.csv
│       ├── y_test.csv
│       ├── X_train_smote.csv
│       └── y_train_smote.csv
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
│   ├── xgboost_model.pkl
│   ├── xgboost_threshold.pkl
│   ├── feature_columns.pkl
│   └── scaler.pkl
│
├── README.md
├── requirements.txt
└── .gitignore
The structure above represents the intended project layout. Some generated datasets and model artifacts may be excluded from Git or maintained locally. The original dataset is not committed.
Technology Stack
Area	Tools
Programming language	Python
Data manipulation	Pandas, NumPy
Machine learning	Scikit-learn
Boosting frameworks	XGBoost, LightGBM
Imbalance handling	imbalanced-learn, SMOTE
Visualization	Matplotlib, Seaborn
Model serialization	Pickle, Joblib
Development environment	Jupyter Notebook, VS Code
Version control	Git, GitHub


Installation and Setup
1. Clone the repository
git clone https://github.com/bhaviktalwar/Credit_Card_Fraud_Detection.git
cd Credit_Card_Fraud_Detection
2. Create a virtual environment
python -m venv venv
Activate it on Windows:
venv\Scripts\activate
3. Install dependencies
pip install -r requirements.txt
4. Add the dataset
Download the Kaggle Credit Card Fraud Detection dataset and place the CSV file at:
Data/raw/creditcard.csv
5. Launch Jupyter Notebook
jupyter notebook
Recommended Notebook Execution Order
1. EDA/01_Data_Understanding_and_EDA.ipynb
2. EDA/02_Data_Preprocessing.ipynb
3. Models/03_Logistic_Regression.ipynb
4. Models/04_Random_Forest.ipynb
5. Models/05_XGBoost.ipynb
6. Models/06_LightGBM.ipynb
Run the notebooks in an environment with the dependencies installed and the dataset available at the expected path.
Team Contributions
Team Member	Contribution Area
Bhavik Talwar	Exploratory Data Analysis, data preprocessing, and Random Forest development
Hardika	Logistic Regression and Random Forest threshold-related work
Gauravi	XGBoost development
Harsimrat	LightGBM development


Branching and Collaboration
The project uses individual development branches for collaborative work:
main
├── bhavik
├── hardika
├── gauravi
└── harsimrat
Team members work on their respective branches and merge reviewed changes into main.
Future Enhancements
- Develop a backend REST API for real-time transaction prediction.
- Build an interactive frontend dashboard.
- Display transaction risk scores and prediction history.
- Add visual model-performance monitoring.
- Integrate a database for transaction records.
- Introduce authentication and user management.
- Deploy the application to a cloud platform.
- Monitor model drift and periodically retrain using reviewed data.
Disclaimer
This project is intended for educational and research purposes. Its predictions should not be treated as a definitive determination of fraud. A production-grade fraud detection system would require extensive validation, security controls, human review processes, monitoring, and domain-specific safeguards.
<div align="center">Built as a collaborative machine learning project

Turning transaction data into actionable fraud-risk signals.
</div>
