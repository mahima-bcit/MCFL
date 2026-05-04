import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { AdminScenarioSummary } from "../../../types/adminScenarios";

const COLORS = ["#2563eb", "#7c3aed", "#10b981"];

type Props = {
  scenarios: AdminScenarioSummary[];
  totalCompletions: number;
};

export default function TopScenariosChart({ scenarios, totalCompletions }: Props) {
  const top3 = [...scenarios]
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-6">
      {/* Donut */}
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={top3}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={74}
              dataKey="completions"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {top3.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-bold leading-none text-[#0f172a]">
            {totalCompletions}
          </span>
          <span className="mt-1 text-[11px] text-slate-400">Completions</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3.5 min-w-0">
        {top3.map((scenario, i) => (
          <div key={scenario.scenarioId} className="flex items-start gap-2.5 min-w-0">
            <span
              className="mt-0.75 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#0f172a]">
                {scenario.title}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {scenario.completions} completions ({scenario.percentageOfTotal.toFixed(1)}%)
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#10b981]">
                +{scenario.avgConfidenceGain.toFixed(1)}% Confidence Gain
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
