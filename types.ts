export interface ModelArtifact {
  version: number;
  degree: number;
  feature_names: string[];
  poly_feature_names: string[];
  poly_powers: number[][];
  scaler_mean: number[];
  scaler_scale: number[];
  coefficients: number[];
  intercept: number;
  metrics: {
    r2: number;
    mae: number;
    rmse: number;
  };
  data_ranges: {
    TV: { min: number; max: number };
    Radio: { min: number; max: number };
    Newspaper: { min: number; max: number };
    Sales: { min: number; max: number };
  };
}

export interface BudgetInput {
  TV: number;
  Radio: number;
  Newspaper: number;
}

export type Channel = keyof BudgetInput;

export interface MarginalReturn {
  spend: number;
  sales: number;
  marginal: number;
}

export interface ChannelInsight {
  channel: Channel;
  color: string;
  hasDiminishingReturns: boolean;
  peakMarginalSpend: number | null;
  quadraticCoeff: number | null;
}
