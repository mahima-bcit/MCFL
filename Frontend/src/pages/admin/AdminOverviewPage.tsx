import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import StatCard from "../../components/admin/overview/StatCard";
import MetricBar from "../../components/admin/overview/MetricBar";
import AdminCard from "../../components/admin/ui/AdminCard";
import { getAdminOverview } from "../../services/adminOverviewApi";
import type {
  AdminOverview,
  OverviewRangeKey,
} from "../../types/adminOverview";
import UserGrowthChart from "../../components/admin/overview/UserGrowthChart";
import { Download, Filter, Heart, Users, Wallet } from "lucide-react";

const rangeOptions: { key: OverviewRangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last7Days", label: "Last 7 Days" },
  { key: "last30Days", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "thisYear", label: "This Year" },
  { key: "allTime", label: "All Time" },
  { key: "custom", label: "Custom" },
];

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRange, setSelectedRange] =
    useState<OverviewRangeKey>("allTime");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const result = await getAdminOverview({
          range: selectedRange,
          startDate: selectedRange === "custom" ? customStartDate : undefined,
          endDate: selectedRange === "custom" ? customEndDate : undefined,
        });

        setData(result);
      } catch {
        setError("Failed to load overview.");
      } finally {
        setLoading(false);
      }
    }

    if (selectedRange === "custom") {
      if (customStartDate && customEndDate) {
        load();
      }
      return;
    }

    load();
  }, [selectedRange, customStartDate, customEndDate]);

  return (
    <AdminLayout>
      {loading && <p className="text-slate-600">Loading overview...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="space-y-2.5 md:space-y-6">
          <AdminCard className="p-3.5 md:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-slate-600" />
                  <h2 className="text-[18px] font-semibold text-[#0f172a]">
                    Filter by Date Range
                  </h2>
                </div>

                {/* Mobile actions row */}
                <div className="mt-3 flex gap-2 md:hidden">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen((prev) => !prev)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#dbe6f5] bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff]"
                  >
                    <Filter size={16} />
                    <span>{isMobileFilterOpen ? "Hide Filter" : "Filter"}</span>
                  </button>

                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f]"
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                </div>

                {/* Mobile dropdown */}
                {isMobileFilterOpen && (
                  <div className="mt-3 md:hidden">
                    <label
                      htmlFor="admin-date-range"
                      className="mb-2 block text-[13px] font-medium text-slate-500"
                    >
                      Select date range
                    </label>

                    <select
                      id="admin-date-range"
                      value={selectedRange}
                      onChange={(e) =>
                        setSelectedRange(e.target.value as OverviewRangeKey)
                      }
                      className="w-full rounded-2xl border border-[#d9e3f3] bg-white px-4 py-2.5 text-[15px] font-medium text-[#0f172a] outline-none transition focus:border-[#2563eb]"
                    >
                      {rangeOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Desktop / tablet pills */}
                <div className="mt-3 hidden flex-wrap gap-2 md:flex">
                  {rangeOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSelectedRange(option.key)}
                      className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition ${
                        selectedRange === option.key
                          ? "bg-[#2563eb] text-white shadow-sm"
                          : "bg-[#f5f8fc] text-slate-700 hover:bg-[#ebf1fa]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {selectedRange === "custom" && (
                  <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="rounded-xl border border-[#d9e3f3] bg-white px-3 py-2 text-sm text-slate-700"
                    />
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="rounded-xl border border-[#d9e3f3] bg-white px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                )}

                <p className="mt-3 text-[14px] text-slate-500">
                  Showing data from{" "}
                  <span className="font-medium text-slate-800">
                    {data.dateFrom}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-800">
                    {data.dateTo}
                  </span>
                </p>
              </div>

              {/* Desktop export button */}
              <button
                type="button"
                className="hidden items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] md:inline-flex"
              >
                <Download size={16} />
                <span>Export Data</span>
              </button>
            </div>
          </AdminCard>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
            <StatCard
              label="Total Users"
              value={String(data.totalUsers)}
              icon={Users}
              iconBgClassName="bg-[#eef4ff]"
              iconTextClassName="text-[#2563eb]"
            />

            <StatCard
              label="Avg Confidence"
              value={`${data.avgConfidence}%`}
              icon={Heart}
              iconBgClassName="bg-[#f3ecff]"
              iconTextClassName="text-[#7c3aed]"
            />

            <StatCard
              label="Avg Goal Progress"
              value={`$${data.avgSavings}`}
              icon={Wallet}
              iconBgClassName="bg-[#eafaf3]"
              iconTextClassName="text-[#10b981]"
              className="col-span-2 md:col-span-1"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[0.9fr_1.1fr] xl:gap-4">
            <AdminCard className="p-3.5 md:p-6">
              <h2 className="text-[18px] font-semibold text-slate-900 md:text-xl">
                Key Metrics
              </h2>

              <div className="mt-4 space-y-4 md:mt-6 md:space-y-5">
                <MetricBar
                  label="Scenarios Completed"
                  valueText={String(data.scenariosCompleted)}
                  percent={Math.min(data.scenariosCompleted * 10, 100)}
                  barClassName="bg-blue-600"
                />
                <MetricBar
                  label="Decision Quality"
                  valueText={`${data.decisionQuality}%`}
                  percent={data.decisionQuality}
                  barClassName="bg-indigo-500"
                />
              </div>
            </AdminCard>

            <AdminCard className="p-3.5 md:p-6">
              <h2 className="text-[18px] font-semibold text-slate-900 md:text-xl">
                New Users Per Day
              </h2>

              <div className="mt-3 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 p-2.5 md:mt-6 md:rounded-3xl md:p-4">
                <UserGrowthChart data={data.userGrowthSeries} />
              </div>
            </AdminCard>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
