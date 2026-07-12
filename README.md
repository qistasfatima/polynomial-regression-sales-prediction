# Polynomial Regression — Ad Budget Optimizer

Predict product sales from TV, Radio, and Newspaper advertising budgets using a **degree-2 polynomial regression** model. The web app highlights **diminishing returns** at higher spending levels so you can optimize ROI and allocate budgets effectively.

## Project Structure

```
polynomialregressionmodel/
├── advertising.csv          # Training dataset (200 rows)
├── train_model.py           # Trains model & exports JSON artifact
├── requirements.txt         # Python dependencies
└── web/                     # Next.js prediction app
    ├── app/                 # Pages & layout
    ├── components/          # UI components
    ├── lib/                 # Prediction logic (mirrors sklearn pipeline)
    └── public/model/        # Exported model.json
```

## Quick Start

### 1. Train the model

```bash
pip install -r requirements.txt
python train_model.py
```

This writes `web/public/model/model.json` with polynomial coefficients, scaler params, and metrics.

### 2. Run the web app

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — adjust TV, Radio, and Newspaper budgets with sliders and see instant sales predictions plus diminishing-returns charts.

## How It Works

1. **Polynomial features** (degree 2) expand `[TV, Radio, Newspaper]` into linear, squared, and interaction terms — capturing curves and channel synergies.
2. **StandardScaler** normalizes features before **linear regression** fits coefficients.
3. The Next.js app loads `model.json` and runs the same pipeline in the browser for instant predictions.
4. **Marginal return curves** show how much extra sales each additional $1k delivers — when the dashed line falls, you're in diminishing-returns territory.

## Model Performance (test set)

| Metric | Value |
|--------|-------|
| R²     | ~0.95 |
| MAE    | ~0.90 |
| RMSE   | ~1.20 |

## Retraining

After changing `advertising.csv` or `degree` in `train_model.py`, rerun `python train_model.py` and refresh the app.
