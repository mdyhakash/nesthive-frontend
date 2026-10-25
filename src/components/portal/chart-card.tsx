"use client";

import * as React from "react";
import { BarChart3, Table2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { formatBDT, formatBDTCompact } from "@/lib/format";

export interface Series {
  key: string;
  label: string;
  color: string;
}

function ChartTooltip({ active, payload, label, money }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string; money?: boolean }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      <ul className="grid gap-0.5">
        {payload.map((p) => (
          <li key={p.name} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="num ml-auto pl-4 font-semibold">{money ? formatBDT(Math.round(p.value ?? 0)) : p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Bar chart card with a "view as table" toggle (so values never depend on colour alone).
 * One or more series; several series are stacked with a 2px surface gap between segments.
 */
export function BarChartCard({
  title,
  description,
  data,
  xKey,
  series,
  money,
  height = 260,
}: {
  title: string;
  description: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: Series[];
  money?: boolean;
  height?: number;
}) {
  const [table, setTable] = React.useState(false);
  const stacked = series.length > 1;

  return (
    <SectionCard
      title={title}
      description={description}
      className="min-w-0"
      action={
        <Button variant="ghost" size="sm" onClick={() => setTable((t) => !t)} aria-pressed={table}>
          {table ? <BarChart3 aria-hidden="true" /> : <Table2 aria-hidden="true" />}
          {table ? "Chart" : "Table"}
        </Button>
      }
    >
      {table ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold">{xKey === "month" ? "Month" : "Group"}</th>
                {series.map((s) => (
                  <th key={s.key} scope="col" className="py-2 pr-4 text-right font-semibold">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row) => (
                <tr key={String(row[xKey])}>
                  <th scope="row" className="py-2.5 pr-4 text-left font-medium">{row[xKey]}</th>
                  {series.map((s) => (
                    <td key={s.key} className="num py-2.5 pr-4 text-right">{money ? formatBDT(Number(row[s.key])) : row[s.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div role="img" aria-label={`${title}. Switch to table view for exact values.`} style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height }}>
            <BarChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} width={money ? 52 : 36} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(v: number) => (money ? formatBDTCompact(v).replace("৳", "") : String(v))} />
              <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.5 }} content={<ChartTooltip money={money} />} />
              {stacked && <Legend iconType="square" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
              {series.map((s, i) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={s.color}
                  stackId={stacked ? "a" : undefined}
                  stroke={stacked ? "var(--card)" : undefined}
                  strokeWidth={stacked ? 2 : 0}
                  radius={stacked ? (i === series.length - 1 ? [4, 4, 0, 0] : 0) : [4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
