"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { MarginalReturn } from "@/lib/types";
import type { Channel } from "@/lib/types";

interface DiminishingReturnsChartProps {
  channel: Channel;
  color: string;
  data: MarginalReturn[];
  currentSpend: number;
  hasDiminishingReturns: boolean;
}

export default function DiminishingReturnsChart({
  channel,
  color,
  data,
  currentSpend,
  hasDiminishingReturns,
}: DiminishingReturnsChartProps) {
  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-semibold text-slate-800">{channel}</h3>
        </div>
        {hasDiminishingReturns && (
          <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">
            Diminishing returns
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="spend"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            label={{
              value: "Spend ($k)",
              position: "insideBottom",
              offset: -2,
              fontSize: 11,
              fill: "#94a3b8",
            }}
          />
          <YAxis
            yAxisId="sales"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            width={40}
          />
          <YAxis
            yAxisId="marginal"
            orientation="right"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            width={45}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [
              value.toFixed(3),
              name === "sales" ? "Sales" : "Marginal return",
            ]}
            labelFormatter={(label) => `Spend: $${Number(label).toFixed(1)}k`}
          />
          <Area
            yAxisId="sales"
            type="monotone"
            dataKey="sales"
            fill={color}
            fillOpacity={0.1}
            stroke={color}
            strokeWidth={2}
            name="sales"
          />
          <Line
            yAxisId="marginal"
            type="monotone"
            dataKey="marginal"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            name="marginal"
          />
          <ReferenceLine
            yAxisId="sales"
            x={currentSpend}
            stroke="#64748b"
            strokeDasharray="3 3"
            label={{
              value: "You",
              position: "top",
              fontSize: 10,
              fill: "#64748b",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-500">
        <span className="inline-block w-3 h-0.5 mr-1 align-middle" style={{ backgroundColor: color }} />
        Sales curve &nbsp;·&nbsp;
        <span className="inline-block w-3 h-0.5 mr-1 align-middle bg-red-500" style={{ borderTop: "2px dashed #ef4444" }} />
        Marginal return (slope) — flattens at higher spend
      </p>
    </div>
  );
}
