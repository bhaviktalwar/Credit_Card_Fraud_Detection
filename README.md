💳 Credit Card Fraud Detection System
A machine-learning project that identifies potentially fraudulent credit
card transactions using historical transaction data. The project
explores the dataset, handles severe class imbalance, trains four
classification models, compares their performance, and saves model
artifacts for a future prediction application.
Project status: Model development and evaluation are documented in
the notebooks. A backend API and frontend application are planned
future enhancements; they are not presented as completed features.

📌 Project Overview
Credit card fraud is a major challenge in digital payments. This project
classifies each transaction into one of two classes:
- 0 --- Genuine transaction
- 1 --- Fraudulent transaction
The dataset is highly imbalanced: fraudulent transactions make up only a
very small proportion of all records. Therefore, the project focuses on
fraud-sensitive evaluation metrics rather than relying on accuracy
alone.
🎯 Objectives
- Explore and understand the transaction dataset.
- Clean and preprocess the data.
- Handle class imbalance using SMOTE on training data only.
- Train and compare Logistic Regression, Random Forest, XGBoost, and
  LightGBM.
- Evaluate models using Precision, Recall, F1-score, ROC-AUC, and
  PR-AUC.
- Examine classification thresholds and their effect on fraud
  detection.
- Save the selected model and the artifacts required by its prediction
  pipeline.
- Prepare the machine-learning component for future application
  integration.
🗂️ Dataset
The project uses the public Credit Card Fraud Detection dataset from
Kaggle.
- Rows: 284,807 transactions
- Columns: 31
- Features: Time, V1--`V28`, and Amount
- Target: Class
V1--`V28` are anonymized numerical features that are already
PCA-transformed in the source dataset; they were not created by applying
PCA as a preprocessing step in this project.

The original dataset is not included in this repository. Download it
from Kaggle and place creditcard.csv in Data/raw/ before running the
notebooks.
🏗️ Project Workflow
Raw Dataset
    |
    v
Data Understanding & Exploratory Data Analysis
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
    |-- Logistic Regression
    |-- Random Forest
    |-- XGBoost
    |-- LightGBM
    |
    v
Model Evaluation & Comparison
    |
    v
Threshold Analysis
    |
    v
Selected Model & Saved Artifacts
    |
    v
Future Backend API and Frontend Integration
To avoid data leakage, the data is split before applying SMOTE.
Validation and test data retain their original class distribution. The
same split and evaluation approach should be used when comparing models.
📂 Project Structure
Credit_Card_Fraud_Detection/
│
├── Data/
│   ├── raw/
│   │   └── creditcard.csv                 # Download separately; not tracked by Git
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
│   └── scaler.pkl                         # Include only if used by the final pipeline
│
├── README.md
├── requirements.txt
└── .gitignore
The exact files present in Models/ may vary as the team updates and
merges its branches. Only include an artifact in the deployed prediction
pipeline if it is actually used by that model.
🔎 Exploratory Data Analysis
The EDA notebooks investigate:
- Dataset dimensions, data types, and summary statistics.
- Missing values and duplicate records.
- Genuine-versus-fraud transaction distribution.
- Transaction amount and time distributions.
- Feature distributions.
- Relationships and correlations among features.
- Potential outliers and unusual patterns.
The target distribution is especially important because the number of
genuine transactions is much larger than the number of fraudulent
transactions.
⚙️ Data Preprocessing and Class Imbalance
The preprocessing workflow includes:
1. Separating input features from the target (Class).
2. Creating training, validation, and test sets.
3. Applying feature scaling where required by the model.
4. Applying SMOTE (Synthetic Minority Over-sampling Technique) to
   the training data only.
5. Preserving the expected feature names and order for prediction.
SMOTE creates synthetic minority-class examples to help the model learn
fraud patterns. It must not be applied to validation or test data, as
doing so would cause data leakage and produce an unrealistic evaluation.

Tree-based models such as Random Forest, XGBoost, and LightGBM generally
do not require standard feature scaling. The final inference pipeline
should follow the exact preprocessing used when the selected model was
trained.
🤖 Machine Learning Models
Four models are trained and compared:
1. Logistic Regression
A baseline classification algorithm that estimates the probability of a
transaction belonging to the fraud class.
2. Random Forest
An ensemble of decision trees that can learn non-linear relationships in
transaction features.
3. XGBoost
A gradient-boosting algorithm that builds decision trees sequentially
and is effective for structured/tabular data.
4. LightGBM
A gradient-boosting framework designed for efficient training on large
tabular datasets.
📊 Model Evaluation and Current Results
The following are the latest metric values shared for the project:

  Model                   Precision   Recall   F1-score   ROC-AUC   PR-AUC
  Logistic Regression        0.0503   0.8803     0.0952    0.9665   0.6913
Random Forest              0.9643   0.5704     0.7168    0.9669   0.8204
XGBoost                    0.9008   0.7676     0.8289    0.9634   0.8004
LightGBM                   0.9174   0.7042     0.7968    0.9599   0.7114

Important comparison note: These are the latest reported results,
not a guarantee that every model was evaluated using an identical test
split and threshold-selection procedure. Confirm that all four results
use the same untouched test set and a consistent validation-based
threshold methodology before treating the table as a strictly controlled
benchmark.
What the metrics mean
- Precision: Of the transactions predicted as fraud, the
  proportion that were actually fraud.
- Recall: Of all actual fraud transactions, the proportion
  detected by the model.
- F1-score: Harmonic mean of Precision and Recall.
- ROC-AUC: Measures the model's ability to rank positive cases
  above negative cases across thresholds.
- PR-AUC: Summarizes the precision-recall trade-off and is
  especially informative for highly imbalanced datasets.
- Confusion Matrix: Shows true positives, true negatives, false
  positives, and false negatives.
Accuracy alone is not sufficient for this problem because a model can
achieve high accuracy by predicting the majority class.
🏆 Current Model Selection
Based on the latest reported metrics, XGBoost is the preliminary
choice when F1-score is the main selection criterion:
- XGBoost has the highest reported F1-score: 0.8289.
- Random Forest has the highest reported Precision: 0.9643.
- Random Forest has the highest reported PR-AUC: 0.8204.
The best model ultimately depends on the project's operational priority.
Higher recall can reduce missed fraud, while higher precision can reduce
false fraud alerts. Before finalizing the selection, verify that the
models were evaluated on the same test split and with a consistent
threshold-selection process.
🎚️ Threshold Analysis
A classifier produces a probability score. A threshold converts that
score into a class prediction:
Probability >= threshold  -> Fraud
Probability < threshold   -> Genuine
Changing the threshold affects Precision, Recall, false positives, and
false negatives. The threshold should be selected using validation data,
then evaluated on the untouched test set. Do not tune the threshold on
the test set.

The latest XGBoost artifact work recorded a threshold value of 0.9.
Confirm that this value is the final validation-selected threshold
associated with the saved model before using it in an application.
💾 Saved Model Artifacts
The current XGBoost model-saving workflow uses the following files:
  Artifact                            Purpose
  xgboost_model.pkl                 Serialized trained XGBoost model.

  xgboost_threshold.pkl             Saved classification threshold
associated with the XGBoost
workflow.

  feature_columns.pkl               Expected input feature names and
order.
scaler.pkl                        Scaling object, only if the actual
model pipeline requires it.
The selected model and its inference preprocessing must match. Do not
apply a scaler to XGBoost merely because a scaler file exists in the
repository; use it only if the model was trained with that scaling step.

Pickle files should only be loaded from trusted sources. Model artifacts
created with different versions of Python or machine-learning libraries
may not be compatible.
🔄 Intended Prediction Pipeline
For a new transaction, the inference workflow should:
New Transaction
    |
    v
Validate Required Input Features
    |
    v
Arrange Features in Training-Time Order
    |
    v
Apply Required Preprocessing (if any)
    |
    v
Load xgboost_model.pkl
    |
    v
Generate Fraud Probability
    |
    v
Apply the Associated Threshold
    |
    v
Return Fraud / Genuine Prediction
The input must contain the same features, in the same order and with the
same preprocessing expected by the trained model. The threshold must
correspond to the loaded model.
🛠️ Technologies Used
- Language: Python
- Data processing: Pandas, NumPy
- Machine learning: Scikit-learn, XGBoost, LightGBM
- Imbalance handling: imbalanced-learn (SMOTE)
- Visualization: Matplotlib, Seaborn
- Model serialization: Pickle / Joblib
- Development: Jupyter Notebook, VS Code
- Version control: Git, GitHub
📦 Installation
1. Clone the repository
git clone https://github.com/bhaviktalwar/Credit_Card_Fraud_Detection.git
cd Credit_Card_Fraud_Detection
2. Create and activate a virtual environment
On Windows:
python -m venv venv
venv\Scripts\activate
3. Install dependencies
pip install -r requirements.txt
4. Add the dataset
Download the Kaggle Credit Card Fraud Detection dataset and place
creditcard.csv in:
Data/raw/creditcard.csv
The dataset is not committed to this repository.
▶️ Running the Notebooks
Start Jupyter Notebook:
jupyter notebook
Run the notebooks in this general order:
1. EDA/01_Data_Understanding_and_EDA.ipynb
2. EDA/02_Data_Preprocessing.ipynb
3. Models/03_Logistic_Regression.ipynb
4. Models/04_Random_Forest.ipynb
5. Models/05_XGBoost.ipynb
6. Models/06_LightGBM.ipynb
Notebook outputs and saved artifacts may depend on the local dataset
path and the environment in which the notebooks are executed.
👥 Team Contributions
The project is developed collaboratively. The contribution summary below
reflects the work areas currently documented by the team; update it if
responsibilities change.
  Team Member                         Work Area
  Bhavik Talwar                   Exploratory Data Analysis, data
preprocessing, and Random Forest
work

  Hardika                         Logistic Regression and Random
Forest threshold-related work

  Gauravi                         XGBoost
Harsimrat                       LightGBM
🌿 Git Branch Strategy
The team uses separate working branches:
main
├── bhavik
├── hardika
├── gauravi
└── harsimrat
Each member develops their assigned work on their branch. Changes are
reviewed and merged into main so the main branch contains the
integrated project.
🚀 Future Enhancements
- Build a backend REST API for transaction predictions.
- Develop an interactive frontend dashboard.
- Display fraud probability and prediction history.
- Add model-performance visualizations.
- Integrate a database for transaction records.
- Add authentication and user management.
- Deploy the application to cloud infrastructure.
- Monitor model performance and investigate model drift.
- Retrain the model using newly reviewed transaction data.
⚠️ Disclaimer
This project is developed for educational and research purposes. Its
predictions should not be treated as a definitive determination that a
financial transaction is fraudulent. A production fraud-detection system
would require extensive validation, security controls, monitoring, and
domain-specific review.
⭐ Conclusion
This project demonstrates a machine-learning workflow for credit card
fraud detection, including exploratory analysis, preprocessing,
class-imbalance handling, model training, model comparison, threshold
analysis, and model serialization. The current reported results make
XGBoost a preliminary F1-based selection, while Random Forest shows
stronger reported Precision and PR-AUC. Consistent evaluation on the
same test split is required before making a final deployment decision.
