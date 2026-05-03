import { useEffect, useState } from "react";
import {
  Activity,
  ChevronDown,
  Coins,
  Download,
  Filter,
  Search,
  Settings2,
  Sparkles,
  Target,
} from "lucide-react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminCard from "../../components/admin/ui/AdminCard";
import CompactScenarioStatCard from "../../components/admin/scenarios/CompactScenarioStatCard";
import { getAdminScenarios } from "../../services/adminScenariosApi";
import type { AdminScenarios } from "../../types/adminScenarios";
import { Link } from "react-router-dom";
import { downloadCsv } from "../../utils/csvExport";

type DirectionFilter = "all" | "positive" | "negative";

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

  const [nameSearch, setNameSearch] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState<DirectionFilter>("all");
  const [moneyFilter, setMoneyFilter] = useState<DirectionFilter>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    nameSearch !== "" || confidenceFilter !== "all" || moneyFilter !== "all";

  function handleExport() {
    if (filteredScenarios.length === 0) return;

    const headers = [
      "Scenario Name",
      "Most Chosen Option",
      "Times Played",
      "Avg Confidence Change",
      "Avg Money Change",
      "% of All Plays",
    ];
    const rows = filteredScenarios.map((s) => [
      s.title,
      s.mostPopularChoice,
      s.completions,
      formatSignedPercent(s.avgConfidenceGain),
      formatSignedMoney(s.avgMoneyImpact),
      `${s.percentageOfTotal.toFixed(1)}%`,
    ]);

    downloadCsv("scenarios.csv", headers, rows);
  }

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

  const filteredScenarios = (data?.scenarios ?? []).filter((s) => {
    if (nameSearch && !s.title.toLowerCase().includes(nameSearch.toLowerCase()))
      return false;
    if (confidenceFilter === "positive" && s.avgConfidenceGain <= 0) return false;
    if (confidenceFilter === "negative" && s.avgConfidenceGain >= 0) return false;
    if (moneyFilter === "positive" && s.avgMoneyImpact <= 0) return false;
    if (moneyFilter === "negative" && s.avgMoneyImpact >= 0) return false;
    return true;
  });

const scenarioCountText = data
    ? hasActiveFilters
      ? `${filteredScenarios.length} of ${data.scenarios.length} scenarios`
      : `${data.scenarios.length} ${data.scenarios.length === 1 ? "scenario" : "scenarios"}`
    : loading
      ? "Loading scenarios..."
      : "";

  return (
    <AdminLayout>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <AdminCard className="p-5 md:p-6">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[20px] font-semibold leading-tight text-[#0f172a]">
                Active Scenarios
              </h2>
              <p className="mt-1.5 text-[14px] text-slate-500">
                {scenarioCountText}
              </p>
            </div>

            {/* Mobile: icon pill */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] md:hidden">
              <Target size={16} className="text-[#2563eb]" />
            </div>

            {/* Desktop: action buttons */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/admin/scenarios/manage"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
              >
                <Settings2 size={16} />
                <span>Manage Scenarios</span>
              </Link>
              <button
                type="button"
                onClick={handleExport}
                disabled={loading || filteredScenarios.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} />
                <span>Export Scenarios</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile action row */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:hidden">
          <Link
            to="/admin/scenarios/manage"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
          >
            <Settings2 size={16} />
            <span>Manage</span>
          </Link>
          <button
            type="button"
            onClick={handleExport}
            disabled={loading || filteredScenarios.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={16} />
            <span className="md:hidden">Export</span>
            <span className="hidden md:inline">Export Scenarios</span>
          </button>
        </div>

        {/* Stat cards */}
        {!loading && data && (
          <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
            <CompactScenarioStatCard
              label="Total Plays"
              value={String(data.totalCompletions)}
              icon={Activity}
              iconBgClassName="bg-[#eafaf3]"
              iconTextClassName="text-[#10b981]"
              helperText="All recorded plays"
              helperTextClassName="text-[#10b981]"
              inlineLabel
            />

            <CompactScenarioStatCard
              label="Average Confidence Change"
              value={formatSignedPercent(data.avgConfidenceGain)}
              icon={Sparkles}
              iconBgClassName="bg-[#f3ecff]"
              iconTextClassName="text-[#7c3aed]"
              helperText="Average per play"
              helperTextClassName="text-[#10b981]"
              inlineLabel
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
              inlineLabel
            />
          </div>
        )}

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen((v) => !v)}
          className="mb-3 inline-flex h-12 w-full items-center gap-2 rounded-full border border-[#d9e3f3] bg-white px-4 text-[15px] font-semibold text-[#0f172a] shadow-sm transition hover:bg-slate-50 md:hidden"
        >
          <Filter size={18} className="text-[#4f46e5]" />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
              Active
            </span>
          )}
          <ChevronDown
            size={17}
            className={[
              "ml-auto text-slate-500 transition-transform duration-200",
              isMobileFiltersOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* Filter panel */}
        <div
          className={[
            "mb-5 rounded-3xl border border-[#dbe6f5] bg-[#f8fbff] p-4",
            isMobileFiltersOpen ? "block" : "hidden",
            "md:block",
          ].join(" ")}
        >
          <div className="mb-3 hidden items-center gap-2 text-[15px] font-semibold text-[#0f172a] md:flex">
            <Filter size={17} className="text-[#2563eb]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                Active
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            {/* Name search */}
            <div className="min-w-0 md:flex-1">
              <label className="mb-1 block text-[13px] font-medium text-slate-600">
                Scenario Name
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  placeholder="Search scenarios…"
                  className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white py-2 pl-9 pr-3 text-[14px] text-[#0f172a] outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Confidence direction */}
            <div className="md:w-44">
              <label className="mb-1 block text-[13px] font-medium text-slate-600">
                Avg Confidence Change
              </label>
              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value as DirectionFilter)}
                className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white px-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All</option>
                <option value="positive">+ Positive</option>
                <option value="negative">− Negative</option>
              </select>
            </div>

            {/* Money direction */}
            <div className="md:w-44">
              <label className="mb-1 block text-[13px] font-medium text-slate-600">
                Avg Money Change
              </label>
              <select
                value={moneyFilter}
                onChange={(e) => setMoneyFilter(e.target.value as DirectionFilter)}
                className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white px-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All</option>
                <option value="positive">+ Positive</option>
                <option value="negative">− Negative</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <p className="text-[14px] text-slate-500">Loading scenarios...</p>
        )}

        {!loading && data && (
          <>
            {filteredScenarios.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-5 py-8 text-center">
                <p className="text-[15px] font-semibold text-[#0f172a]">
                  No scenarios match the current filters
                </p>
                <p className="mt-1 text-[14px] text-slate-500">
                  Try changing or clearing the filters.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="space-y-3 md:hidden">
                  {filteredScenarios.map((scenario) => (
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
                <div className="hidden overflow-hidden rounded-2xl border border-[#e8eef8] md:block">
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
                          <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            Scenario Name
                          </th>
                          <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            Most Chosen Option
                          </th>
                          <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            Times Played
                          </th>
                          <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            Avg Confidence Change
                          </th>
                          <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            Avg Money Change
                          </th>
                          <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            % of All Plays
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredScenarios.map((scenario, index) => (
                          <tr
                            key={scenario.scenarioId}
                            className={`h-23 ${
                              index !== filteredScenarios.length - 1
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
                              <p className="line-clamp-2 wrap-break-word text-[14px] leading-6 text-[#2563eb]">
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
                </div>
              </>
            )}
          </>
        )}
      </AdminCard>
    </AdminLayout>
  );
}
