"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import HeroSection from "@/components/sections/HeroSection";
import InputSection from "@/components/sections/InputSection";
import ResultSection from "@/components/sections/ResultSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import ModelAccordion from "@/components/sections/ModelAccordion";
import BudgetSalesChart from "@/components/sections/BudgetSalesChart";
import ProjectOverview from "@/components/sections/ProjectOverview";
import Footer from "@/components/sections/Footer";
import {
  loadModel,
  predictSales,
  generateBudgetSalesCurve,
} from "@/lib/model";
import type { BudgetInput as Budget, ModelArtifact, Channel } from "@/lib/types";

const DEFAULT_BUDGET: Budget = { TV: 100, Radio: 30, Newspaper: 30 };

export default function Home() {
  const [model, setModel] = useState<ModelArtifact | null>(null);
  const [budget, setBudget] = useState<Budget>(DEFAULT_BUDGET);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState(0);

  useEffect(() => {
    loadModel()
      .then(setModel)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const hasErrors = useMemo(() => {
    if (!model) return true;
    const channels: Channel[] = ["TV", "Radio", "Newspaper"];
    return channels.some((ch) => {
      const { min, max } = model.data_ranges[ch];
      const v = budget[ch];
      return isNaN(v) || v < min || v > max;
    });
  }, [model, budget]);

  const totalBudget = budget.TV + budget.Radio + budget.Newspaper;

  const chartData = useMemo(() => {
    if (!model) return [];
    return generateBudgetSalesCurve(model, budget);
  }, [model, budget]);

  const updateBudget = useCallback((channel: Channel, value: number) => {
    setBudget((prev) => ({ ...prev, [channel]: value }));
    setShowResult(false);
  }, []);

  const handlePredict = useCallback(async () => {
    if (!model || hasErrors) return;
    setIsPredicting(true);
    setShowResult(false);

    await new Promise((r) => setTimeout(r, 900));

    const result = predictSales(model, budget);
    setPrediction(result);
    setIsPredicting(false);
    setShowResult(true);
  }, [model, budget, hasErrors]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <AnimatedBackground />
        <div className="text-center space-y-4 relative z-10">
          <div className="w-12 h-12 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted">Loading ML model...</p>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center text-status-warning">
          <p className="font-semibold text-lg">Failed to load model</p>
          <p className="text-sm mt-2 text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />

      <HeroSection />

      <InputSection
        budget={budget}
        ranges={model.data_ranges}
        onChange={updateBudget}
        onPredict={handlePredict}
        isPredicting={isPredicting}
        hasErrors={hasErrors}
      />

      <ResultSection
        predictedSales={prediction}
        totalBudget={totalBudget}
        show={showResult}
        model={model}
      />

      <BudgetSalesChart
        data={chartData}
        currentBudget={totalBudget}
        currentSales={prediction}
        show={showResult}
      />

      <BenefitsSection />

      <ModelAccordion />

      <ProjectOverview />

      <Footer />
    </main>
  );
}
