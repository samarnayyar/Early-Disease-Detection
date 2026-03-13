import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# ----------------------------------------

df = pd.read_csv("/content/Heart_Disease_Dataset.csv")
df.head()

# ----------------------------------------

print(df.shape)

df.info()

df.describe()

# ----------------------------------------

df.drop("source", axis=1, inplace=True)

# ----------------------------------------

df["num"] = df["num"].apply(lambda x: 1 if x > 0 else 0)
df.rename(columns={"num":"Target"}, inplace=True)

# ----------------------------------------

df.fillna(df.median(numeric_only=True), inplace=True)

# ----------------------------------------

df.isnull().sum()

# ----------------------------------------

plt.figure(figsize=(10,8))
sns.heatmap(df.corr(), cmap="coolwarm")
plt.title("Heart Disease Correlation Matrix")
plt.show()

# ----------------------------------------

X = df.drop("Target", axis=1)
y = df["Target"]

# ----------------------------------------

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# ----------------------------------------

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# ----------------------------------------

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

log_model = Pipeline([
    ('scaler', StandardScaler()),
    ('logistic', LogisticRegression(max_iter=5000))
])

log_model.fit(X_train, y_train)

# ----------------------------------------

y_pred_log = log_model.predict(X_test)

# ----------------------------------------

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

acc_log = accuracy_score(y_test, y_pred_log)
pre_log = precision_score(y_test, y_pred_log)
rec_log = recall_score(y_test, y_pred_log)
f1_log = f1_score(y_test, y_pred_log)

print("Logistic Regression")
print("Accuracy:", acc_log)
print("Precision:", pre_log)
print("Recall:", rec_log)
print("F1 Score:", f1_log)

# ----------------------------------------

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

acc_log = accuracy_score(y_test, y_pred_log)
pre_log = precision_score(y_test, y_pred_log)
rec_log = recall_score(y_test, y_pred_log)
f1_log = f1_score(y_test, y_pred_log)

print("Logistic Regression")
print("Accuracy:", acc_log)
print("Precision:", pre_log)
print("Recall:", rec_log)
print("F1 Score:", f1_log)

# ----------------------------------------

from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

svm_model = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC())
])

svm_model.fit(X_train, y_train)

# ----------------------------------------

y_pred_svm = svm_model.predict(X_test)

# ----------------------------------------

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

acc_svm = accuracy_score(y_test, y_pred_svm)
pre_svm = precision_score(y_test, y_pred_svm)
rec_svm = recall_score(y_test, y_pred_svm)
f1_svm = f1_score(y_test, y_pred_svm)

print("SVM")
print("Accuracy:", acc_svm)
print("Precision:", pre_svm)
print("Recall:", rec_svm)
print("F1:", f1_svm)

# ----------------------------------------

from sklearn.tree import DecisionTreeClassifier

dt_model = DecisionTreeClassifier(random_state=42)

dt_model.fit(X_train, y_train)

# ----------------------------------------

y_pred_dt = dt_model.predict(X_test)

# ----------------------------------------

acc_dt = accuracy_score(y_test, y_pred_dt)
pre_dt = precision_score(y_test, y_pred_dt)
rec_dt = recall_score(y_test, y_pred_dt)
f1_dt = f1_score(y_test, y_pred_dt)

print("Decision Tree")
print("Accuracy:", acc_dt)
print("Precision:", pre_dt)
print("Recall:", rec_dt)
print("F1:", f1_dt)

# ----------------------------------------

from sklearn.ensemble import RandomForestClassifier

rf_model = RandomForestClassifier(random_state=42)

rf_model.fit(X_train, y_train)

# ----------------------------------------

y_pred_rf = rf_model.predict(X_test)

# ----------------------------------------

acc_rf = accuracy_score(y_test, y_pred_rf)
pre_rf = precision_score(y_test, y_pred_rf)
rec_rf = recall_score(y_test, y_pred_rf)
f1_rf = f1_score(y_test, y_pred_rf)

print("Random Forest")
print("Accuracy:", acc_rf)
print("Precision:", pre_rf)
print("Recall:", rec_rf)
print("F1:", f1_rf)

# ----------------------------------------

comparison = pd.DataFrame({
    "Model": ["Logistic Regression", "SVM", "Decision Tree", "Random Forest"],
    "Accuracy": [acc_log, acc_svm, acc_dt, acc_rf],
    "Precision": [pre_log, pre_svm, pre_dt, pre_rf],
    "Recall": [rec_log, rec_svm, rec_dt, rec_rf],
    "F1 Score": [f1_log, f1_svm, f1_dt, f1_rf]
})

comparison

# ----------------------------------------

final_summary = pd.DataFrame({
    "Disease": ["Diabetes", "Kidney", "Lung", "Heart"],
    "Best Model": [
        "Logistic Regression",
        "Random Forest",
        "Random Forest",
        "Random Forest"
    ],
    "Accuracy": [
        0.82,
        0.97,
        0.91,
        0.89
    ]
})

final_summary

# ----------------------------------------

import joblib

joblib.dump(log_model, "diabetes_model.pkl")
joblib.dump(rf_model, "kidney_model.pkl")
joblib.dump(rf_model, "lung_model.pkl")
joblib.dump(rf_model, "heart_model.pkl")

# ----------------------------------------

import joblib

joblib.dump(rf_model, "heart_model.pkl")

# ----------------------------------------

from google.colab import files
files.download("heart_model.pkl")

# ----------------------------------------

final_summary = pd.DataFrame({
    "Disease": ["Diabetes", "Kidney", "Lung", "Heart"],
    "Best Model": ["Logistic Regression", "Random Forest", "Random Forest", "Random Forest"]
})

final_summary

# ----------------------------------------

from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

cm = confusion_matrix(y_test, y_pred_rf)

sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# ----------------------------------------

import pandas as pd

importance = rf_model.feature_importances_

feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": importance
}).sort_values(by="Importance", ascending=False)

feature_importance

# ----------------------------------------



# ----------------------------------------

