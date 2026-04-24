import { useEffect, useState } from "react";
import {
  Activity,
  Coins,
  Download,
  Settings2,
  Sparkles,
  Target,
} from "lucide-react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminCard from "../../components/admin/ui/AdminCard";
import CompactScenarioStatCard from "../../components/admin/scenarios/CompactScenarioStatCard";
import { getAdminScenarios } from "../../services/adminScenariosApi";
import type { AdminScenarios } from "../../types/adminScenarios";

function formatSignedPercent(value: number) {
  const rounded = Number(value.toFixed(1));
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function formatSignedMoney(value: number) {
  const rounded = Number(value.toFixed(2));
  return `${rounded > 0 ? "+" : ""}$${rounded.toFixed(2)}`;
}

function getMoneyColorClass(value: number) {
  if (value > 0) return "text-[#10b981]";
  if (value < 0) return "text-[#f59e0b]";
  return "text-slate-700";
}

export default function AdminScenariosPage() {
  const [data, setData] = useState<AdminScenarios | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const result = await getAdminScenarios();
        setData(result);
      } catch {
        setError("Failed to load scenarios.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <AdminLayout>
      {loading && <p className="text-slate-600">Loading scenarios...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="space-y-3 md:space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] sm:w-auto"
            >
              <Settings2 size={16} />
              <span>Manage Scenarios</span>
            </button>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] sm:w-auto"
            >
              <Download size={16} />
              <span>Export Scenarios</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            <CompactScenarioStatCard
              label="Total Scenarios"
              value={String(data.totalScenarios)}
              icon={Target}
              iconBgClassName="bg-[#eef4ff]"
              iconTextClassName="text-[#2563eb]"
              helperText="Active scenarios"
              helperTextClassName="text-[#10b981]"
            />

            <CompactScenarioStatCard
              label="Total Plays"
              value={String(data.totalCompletions)}
              icon={Activity}
              iconBgClassName="bg-[#eafaf3]"
              iconTextClassName="text-[#10b981]"
              helperText="All recorded plays"
              helperTextClassName="text-[#10b981]"
            />

            <CompactScenarioStatCard
              label="Average Confidence Change"
              value={formatSignedPercent(data.avgConfidenceGain)}
              icon={Sparkles}
              iconBgClassName="bg-[#f3ecff]"
              iconTextClassName="text-[#7c3aed]"
              helperText="Average per play"
              helperTextClassName="text-[#10b981]"
            />

            <CompactScenarioStatCard
              label="Average Money Change"
              value={formatSignedMoney(data.avgMoneyImpact)}
              valueClassName={getMoneyColorClass(data.avgMoneyImpact)}
              icon={Coins}
              iconBgClassName="bg-[#fff7ed]"
              iconTextClassName="text-[#f59e0b]"
              helperText="Average per play"
              helperTextClassName="text-[#10b981]"
            />
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {data.scenarios.map((scenario) => (
              <AdminCard key={scenario.scenarioId} className="p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-[#0f172a]">
                      {scenario.title}
                    </h2>
                    <p className="mt-1 text-[12px] text-slate-500">
                      Most chosen option:{" "}
                      <span className="font-medium text-[#2563eb]">
                        {scenario.mostPopularChoice}
                      </span>
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff]">
                    <Target size={15} className="text-[#2563eb]" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#f5f8fc] p-2.5 text-center">
                    <p className="text-[18px] font-semibold text-[#0f172a]">
                      {scenario.completions}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Times Played
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f5f8fc] p-2.5 text-center">
                    <p className="text-[18px] font-semibold text-[#10b981]">
                      {formatSignedPercent(scenario.avgConfidenceGain)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Average Confidence Change
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f5f8fc] p-2.5 text-center">
                    <p
                      className={`text-[18px] font-semibold ${getMoneyColorClass(
                        scenario.avgMoneyImpact,
                      )}`}
                    >
                      {formatSignedMoney(scenario.avgMoneyImpact)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Average Money Change
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f5f8fc] p-2.5 text-center">
                    <p className="text-[18px] font-semibold text-[#7c3aed]">
                      {scenario.percentageOfTotal.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      % of All Plays
                    </p>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>

          {/* Desktop table */}
          <AdminCard className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[30%]" />
                  <col className="w-[10%]" />
                  <col className="w-[17%]" />
                  <col className="w-[16%]" />
                  <col className="w-[12%]" />
                </colgroup>

                <thead className="bg-[#f5f8fc]">
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Scenario Name
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Most Chosen Option
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Times Played
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Avg Confidence Change
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Avg Money Change
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      % of All Plays
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.scenarios.map((scenario, index) => (
                    <tr
                      key={scenario.scenarioId}
                      className={`h-[92px] ${
                        index !== data.scenarios.length - 1
                          ? "border-b border-[#e8eef8]"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-4 align-middle">
                        <p className="text-[15px] font-semibold text-[#0f172a]">
                          {scenario.title}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p className="text-[14px] leading-6 text-[#2563eb] line-clamp-2 break-words">
                          {scenario.mostPopularChoice}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p className="text-[15px] font-medium text-[#0f172a]">
                          {scenario.completions}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p className="text-[15px] font-medium text-[#10b981]">
                          {formatSignedPercent(scenario.avgConfidenceGain)}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p
                          className={`text-[15px] font-medium ${getMoneyColorClass(
                            scenario.avgMoneyImpact,
                          )}`}
                        >
                          {formatSignedMoney(scenario.avgMoneyImpact)}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <p className="text-[15px] font-medium text-[#7c3aed]">
                          {scenario.percentageOfTotal.toFixed(1)}%
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>
      )}
    </AdminLayout>
  );
}
