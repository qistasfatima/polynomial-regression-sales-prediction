"use client";

import type { ModelArtifact } from "@/lib/types";
import { formatSales } from "@/lib/model";

interface PredictionCardProps {
  predictedSales: number;
  totalBudget: number;
  model: ModelArtifact;
}

export default function PredictionCard({
  predictedSales,
  totalBudget,
  model,
}: PredictionCardProps) {
  const roi = totalBudget > 0 ? predictedSales / totalBudget : 0;
  const salesPct =
    ((predictedSales - model.data_ranges.Sales.min) /
      (model.data_ranges.Sales.max - model.data_ranges.Sales.min)) *
    100;

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          Predicted Sales
        </p>
        <p className="text-5xl font-bold text-brand-700 mt-1">
          {formatSales(predictedSales)}
          <span className="text-lg font-normal text-slate-400 ml-1">
            units (×1000)
          </span>
        </p>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(5, salesPct))}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Total Budget
          </p>
          <p className="text-xl font-semibold text-slate-800 mt-1">
            ${totalBudget.toFixed(1)}k
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            Sales per $1k Spend
          </p>
          <p className="text-xl font-semibold text-slate-800 mt-1">
            {roi.toFixed(3)}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
          Model Accuracy
        </p>
        <div className="flex gap-4 text-sm">
          <span className="text-emerald-600 font-medium">
            R² = {model.metrics.r2}
          </span>
          <span className="text-slate-500">MAE = {model.metrics.mae}</span>
          <span className="text-slate-500">RMSE = {model.metrics.rmse}</span>
        </div>
      </div>
    </div>
  );
}
