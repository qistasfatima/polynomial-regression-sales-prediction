import type {
  BudgetInput,
  Channel,
  ChannelInsight,
  MarginalReturn,
  ModelArtifact,
} from "./types";

let cachedModel: ModelArtifact | null = null;

export async function loadModel(): Promise<ModelArtifact> {
  if (cachedModel) return cachedModel;
  const res = await fetch("/model/model.json");
  if (!res.ok) throw new Error("Failed to load model artifact");
  cachedModel = (await res.json()) as ModelArtifact;
  return cachedModel;
}

function expandPolynomialFeatures(
  values: number[],
  powers: number[][]
): number[] {
  return powers.map((power) =>
    power.reduce((acc, p, i) => acc * Math.pow(values[i], p), 1)
  );
}

function standardize(features: number[], mean: number[], scale: number[]): number[] {
  return features.map((f, i) => (f - mean[i]) / scale[i]);
}

export function predictSales(model: ModelArtifact, budget: BudgetInput): number {
  const values = [budget.TV, budget.Radio, budget.Newspaper];
  const polyFeatures = expandPolynomialFeatures(values, model.poly_powers);
  const scaled = standardize(
    polyFeatures,
    model.scaler_mean,
    model.scaler_scale
  );

  const raw =
    model.intercept +
    scaled.reduce((sum, f, i) => sum + f * model.coefficients[i], 0);

  return Math.max(0, raw);
}

export function generateMarginalCurve(
  model: ModelArtifact,
  channel: Channel,
  fixedBudget: BudgetInput,
  steps = 50
): MarginalReturn[] {
  const range = model.data_ranges[channel];
  const step = (range.max - range.min) / steps;
  const points: MarginalReturn[] = [];

  for (let i = 0; i <= steps; i++) {
    const spend = range.min + step * i;
    const budget = { ...fixedBudget, [channel]: spend };
    const sales = predictSales(model, budget);
    points.push({ spend, sales, marginal: 0 });
  }

  for (let i = 1; i < points.length; i++) {
    const dSpend = points[i].spend - points[i - 1].spend;
    const dSales = points[i].sales - points[i - 1].sales;
    points[i].marginal = dSpend > 0 ? dSales / dSpend : 0;
  }
  if (points.length > 0) points[0].marginal = points[1]?.marginal ?? 0;

  return points;
}

export function getChannelInsights(model: ModelArtifact): ChannelInsight[] {
  const colors: Record<Channel, string> = {
    TV: "#0c8ce9",
    Radio: "#10b981",
    Newspaper: "#f59e0b",
  };

  return model.feature_names.map((name) => {
    const channel = name as Channel;
    const squaredTerm = `${channel}^2`;
    const idx = model.poly_feature_names.indexOf(squaredTerm);
    const quadraticCoeff = idx >= 0 ? model.coefficients[idx] : null;

    const midpoint = {
      TV: (model.data_ranges.TV.min + model.data_ranges.TV.max) / 2,
      Radio: (model.data_ranges.Radio.min + model.data_ranges.Radio.max) / 2,
      Newspaper:
        (model.data_ranges.Newspaper.min + model.data_ranges.Newspaper.max) / 2,
    };

    const curve = generateMarginalCurve(model, channel, midpoint, 60);
    let peakMarginalSpend: number | null = null;
    let maxMarginal = -Infinity;

    for (const point of curve) {
      if (point.marginal > maxMarginal) {
        maxMarginal = point.marginal;
        peakMarginalSpend = point.spend;
      }
    }

    const lateSpend = model.data_ranges[channel].max * 0.85;
    const earlySpend = model.data_ranges[channel].min + 10;
    const lateBudget = { ...midpoint, [channel]: lateSpend };
    const earlyBudget = { ...midpoint, [channel]: earlySpend };
    const lateMarginal =
      generateMarginalCurve(model, channel, midpoint, 60).find(
        (p) => p.spend >= lateSpend
      )?.marginal ?? 0;
    const earlyMarginal =
      generateMarginalCurve(model, channel, midpoint, 60).find(
        (p) => p.spend >= earlySpend
      )?.marginal ?? 0;

    const hasDiminishingReturns = lateMarginal < earlyMarginal * 0.7;

    return {
      channel,
      color: colors[channel],
      hasDiminishingReturns,
      peakMarginalSpend,
      quadraticCoeff,
    };
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSales(value: number): string {
  return value.toFixed(2);
}

export function generateBudgetSalesCurve(
  model: ModelArtifact,
  budget: BudgetInput,
  steps = 40
): { totalBudget: number; sales: number }[] {
  const total =
    budget.TV + budget.Radio + budget.Newspaper || 1;
  const ratio = {
    TV: budget.TV / total,
    Radio: budget.Radio / total,
    Newspaper: budget.Newspaper / total,
  };

  const maxTotal =
    model.data_ranges.TV.max +
    model.data_ranges.Radio.max +
    model.data_ranges.Newspaper.max;

  const points: { totalBudget: number; sales: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (maxTotal / steps) * i;
    const b: BudgetInput = {
      TV: t * ratio.TV,
      Radio: t * ratio.Radio,
      Newspaper: t * ratio.Newspaper,
    };
    points.push({ totalBudget: t, sales: predictSales(model, b) });
  }

  return points;
}
