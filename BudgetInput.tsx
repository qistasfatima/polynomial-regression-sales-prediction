"use client";

import type { Channel } from "@/lib/types";

interface BudgetInputProps {
  channel: Channel;
  value: number;
  min: number;
  max: number;
  color: string;
  onChange: (value: number) => void;
}

const channelDescriptions: Record<Channel, string> = {
  TV: "Television advertising spend (thousands $)",
  Radio: "Radio advertising spend (thousands $)",
  Newspaper: "Newspaper advertising spend (thousands $)",
};

export default function BudgetInput({
  channel,
  value,
  min,
  max,
  color,
  onChange,
}: BudgetInputProps) {
  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <label htmlFor={channel} className="font-semibold text-slate-800">
            {channel}
          </label>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-sm">$</span>
          <input
            id={channel}
            type="number"
            min={min}
            max={max}
            step={0.1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 text-right font-mono text-lg font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-slate-400 text-sm">k</span>
        </div>
      </div>
      <p className="text-xs text-slate-500">{channelDescriptions[channel]}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>${min}k</span>
        <span>${max}k</span>
      </div>
    </div>
  );
}
