"""
Train a polynomial regression model on the Advertising dataset.
Captures non-linear (diminishing returns) relationships between ad spend and sales.
"""

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

DATA_PATH = Path(__file__).parent / "advertising.csv"
MODEL_DIR = Path(__file__).parent / "web" / "public" / "model"
ARTIFACT_PATH = MODEL_DIR / "model.json"
JOBLIB_PATH = MODEL_DIR / "pipeline.joblib"


def train_and_export(degree: int = 2) -> dict:
    df = pd.read_csv(DATA_PATH)
    feature_names = ["TV", "Radio", "Newspaper"]
    X = df[feature_names].values
    y = df["Sales"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline = Pipeline(
        [
            ("poly", PolynomialFeatures(degree=degree, include_bias=False)),
            ("scaler", StandardScaler()),
            ("regressor", LinearRegression()),
        ]
    )

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    metrics = {
        "r2": round(float(r2_score(y_test, y_pred)), 4),
        "mae": round(float(mean_absolute_error(y_test, y_pred)), 4),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 4),
    }

    poly: PolynomialFeatures = pipeline.named_steps["poly"]
    scaler: StandardScaler = pipeline.named_steps["scaler"]
    regressor: LinearRegression = pipeline.named_steps["regressor"]

    # Build human-readable feature names for polynomial terms
    poly_feature_names = poly.get_feature_names_out(feature_names)

    artifact = {
        "version": 1,
        "degree": degree,
        "feature_names": feature_names,
        "poly_feature_names": poly_feature_names.tolist(),
        "poly_powers": poly.powers_.tolist(),
        "scaler_mean": scaler.mean_.tolist(),
        "scaler_scale": scaler.scale_.tolist(),
        "coefficients": regressor.coef_.tolist(),
        "intercept": float(regressor.intercept_),
        "metrics": metrics,
        "data_ranges": {
            "TV": {"min": float(df["TV"].min()), "max": float(df["TV"].max())},
            "Radio": {"min": float(df["Radio"].min()), "max": float(df["Radio"].max())},
            "Newspaper": {
                "min": float(df["Newspaper"].min()),
                "max": float(df["Newspaper"].max()),
            },
            "Sales": {"min": float(df["Sales"].min()), "max": float(df["Sales"].max())},
        },
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    with open(ARTIFACT_PATH, "w", encoding="utf-8") as f:
        json.dump(artifact, f, indent=2)

    joblib.dump(pipeline, JOBLIB_PATH)

    print("Model trained successfully!")
    print(f"  R² Score:  {metrics['r2']}")
    print(f"  MAE:       {metrics['mae']}")
    print(f"  RMSE:      {metrics['rmse']}")
    print(f"  Artifact:  {ARTIFACT_PATH}")

    return artifact


if __name__ == "__main__":
    train_and_export()
