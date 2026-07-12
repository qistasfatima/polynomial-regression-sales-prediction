"use client";

import type { ChannelInsight } from "@/lib/types";

interface ChannelInsightsProps {
  insights: ChannelInsight[];
}

export default function ChannelInsights({ insights }: ChannelInsightsProps) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold text-slate-800 mb-4">
        Channel Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.channel}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-50"
          >
            <span
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: insight.color }}
            />
            <div className="text-sm">
              <p className="font-medium text-slate-800">{insight.channel}</p>
              <p className="text-slate-500 mt-0.5">
                {insight.hasDiminishingReturns ? (
                  <>
                    Shows <strong className="text-amber-700">diminishing returns</strong> at
                    higher budgets. Peak efficiency around{" "}
                    <strong>${insight.peakMarginalSpend?.toFixed(0)}k</strong> spend.
                  </>
                ) : (
                  <>
                    Returns remain relatively strong across the budget range.
                    Peak efficiency around{" "}
                    <strong>${insight.peakMarginalSpend?.toFixed(0)}k</strong> spend.
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
