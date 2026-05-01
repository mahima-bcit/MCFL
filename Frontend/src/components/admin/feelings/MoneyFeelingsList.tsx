import { useState, useEffect, type FormEvent } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Frown,
  Mail,
  Meh,
  Search,
  Smile,
  SmilePlus,
  X,
} from "lucide-react";
import type { AdminMoneyFeelingItem } from "../../../types/adminMoneyFeelings";
import type { AdminMoneyFeelingsFilters } from "../../../services/adminMoneyFeelingsApi";
import AdminCard from "../ui/AdminCard";
import CompactScenarioStatCard from "../scenarios/CompactScenarioStatCard";

type Props = {
  feelings: AdminMoneyFeelingItem[];
  filters: AdminMoneyFeelingsFilters;
  filterError: string;
  loading: boolean;
  onFiltersChange: (filters: AdminMoneyFeelingsFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
};

const FEELING_OPTIONS = ["Good", "Unsure", "Worried"] as const;

function getFeelingBadgeClass(feeling: string) {
  switch (feeling) {
    case "Good":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Unsure":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Worried":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getFeelingEmoji(feeling: string) {
  switch (feeling) {
    case "Good":
      return "😊";
    case "Unsure":
      return "😐";
    case "Worried":
      return "😟";
    default:
      return "";
  }
}

function escapeCsvValue(value: string | number) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function formatLocalDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatLocalTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function MoneyFeelingsList({
  feelings,
  filters,
  filterError,
  loading,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: Props) {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [feelings]);

  const totalPages = Math.max(1, Math.ceil(feelings.length / PAGE_SIZE));
  const pagedFeelings = feelings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasActiveFilters =
    Boolean(filters.feeling) ||
    Boolean(filters.email) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  const todayDate = getTodayDateString();

  const maxStartDate =
    filters.endDate && filters.endDate < todayDate
      ? filters.endDate
      : todayDate;

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  function handleExport() {
    if (feelings.length === 0) return;

    const headers = ["Name", "Email", "Feeling", "Submitted Date"];

    const rows = feelings.map((item) => [
      item.fullName,
      item.email,
      item.feeling,
      item.submittedDate,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "money-feelings.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApplyFilters();
  }

  return (
    <AdminCard className="p-5 md:p-6">
      <div className="mb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[20px] font-semibold leading-tight text-[#0f172a]">
              Money Feelings Submissions
            </h2>
            <p className="mt-1.5 text-[14px] text-slate-500">
              {loading
                ? "Loading submissions..."
                : `${feelings.length} ${feelings.length === 1 ? "submission" : "submissions"}`}
            </p>
          </div>

          {/* Mobile: icon pill */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] md:hidden">
            <SmilePlus size={16} className="text-[#2563eb]" />
          </div>

          {/* Desktop: export button */}
          <button
            type="button"
            onClick={handleExport}
            disabled={feelings.length === 0}
            className="hidden items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
          >
            <Download size={16} />
            <span>Export Feelings</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {!loading && (
        <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
          <CompactScenarioStatCard
            label="Feeling Good"
            value={String(feelings.filter((f) => f.feeling === "Good").length)}
            icon={Smile}
            iconBgClassName="bg-emerald-50"
            iconTextClassName="text-emerald-600"
            valueClassName="text-emerald-700"
            helperText={`${feelings.length ? Math.round((feelings.filter((f) => f.feeling === "Good").length / feelings.length) * 100) : 0}% of total`}
            helperTextClassName="text-[#10b981]"
            helperTextAlignment="left"
            inlineLabel
          />

          <CompactScenarioStatCard
            label="Feeling Unsure"
            value={String(feelings.filter((f) => f.feeling === "Unsure").length)}
            icon={Meh}
            iconBgClassName="bg-amber-50"
            iconTextClassName="text-amber-500"
            valueClassName="text-amber-600"
            helperText={`${feelings.length ? Math.round((feelings.filter((f) => f.feeling === "Unsure").length / feelings.length) * 100) : 0}% of total`}
            helperTextClassName="text-[#10b981]"
            helperTextAlignment="left"
            inlineLabel
          />

          <CompactScenarioStatCard
            label="Feeling Worried"
            value={String(feelings.filter((f) => f.feeling === "Worried").length)}
            icon={Frown}
            iconBgClassName="bg-red-50"
            iconTextClassName="text-red-500"
            valueClassName="text-red-600"
            helperText={`${feelings.length ? Math.round((feelings.filter((f) => f.feeling === "Worried").length / feelings.length) * 100) : 0}% of total`}
            helperTextClassName="text-[#10b981]"
            helperTextAlignment="left"
            inlineLabel
          />
        </div>
      )}

      {/* Mobile action buttons */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen((current) => !current)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#d9e3f3] bg-white px-4 text-[15px] font-semibold text-[#0f172a] shadow-sm transition hover:bg-slate-50"
        >
          <Filter size={18} className="text-[#4f46e5]" />
          <span>Filter</span>
          <ChevronDown
            size={17}
            className={[
              "ml-auto text-slate-500 transition-transform duration-200",
              isMobileFiltersOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={feelings.length === 0}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={17} />
          <span className="md:hidden">Export</span>
          <span className="hidden md:inline">Export Feelings</span>
        </button>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className={[
          "mb-5 rounded-[24px] border border-[#dbe6f5] bg-[#f8fbff] p-4",
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

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">
              Feeling
            </label>
            <select
              value={filters.feeling ?? ""}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  feeling: event.target.value || undefined,
                })
              }
              className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white px-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All feelings</option>
              {FEELING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {getFeelingEmoji(option)} {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">
              Email
            </label>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={filters.email ?? ""}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    email: event.target.value || undefined,
                  })
                }
                placeholder="Search email"
                className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white py-2 pl-9 pr-3 text-[14px] text-[#0f172a] outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">
              From
            </label>
            <input
              type="date"
              value={filters.startDate ?? ""}
              max={maxStartDate}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  startDate: event.target.value || undefined,
                })
              }
              className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white px-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">
              To
            </label>
            <input
              type="date"
              value={filters.endDate ?? ""}
              min={filters.startDate ?? undefined}
              max={todayDate}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  endDate: event.target.value || undefined,
                })
              }
              className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white px-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || Boolean(filterError)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-4 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60 xl:w-auto"
            >
              <Search size={16} />
              Apply
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={onClearFilters}
              disabled={!hasActiveFilters || loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e3f3] bg-white px-4 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 xl:w-auto"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </div>

        {filterError && (
          <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-[14px] font-medium text-red-700">
            {filterError}
          </p>
        )}
      </form>

      {/* Content */}
      {loading ? (
        <div className="rounded-[22px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-5 py-8 text-center">
          <p className="text-[15px] font-semibold text-[#0f172a]">
            Loading submissions...
          </p>
        </div>
      ) : feelings.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-5 py-8 text-center">
          <p className="text-[15px] font-semibold text-[#0f172a]">
            No submissions found
          </p>
          <p className="mt-1 text-[14px] text-slate-500">
            Try changing or clearing the selected filters.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {pagedFeelings.map((item) => (
              <article
                key={item.moneyFeelingSubmissionId}
                className="rounded-[24px] border border-[#dbe6f5] bg-[#f8fbff] p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold text-[#0f172a]">
                      {item.fullName}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-600">
                      <Mail size={14} className="shrink-0 text-slate-400" />
                      <span className="break-all">{item.email}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500">
                    <CalendarDays size={14} className="shrink-0 text-slate-400" />
                    <span>{formatLocalDate(item.submittedDate)} {formatLocalTime(item.submittedDate)}</span>
                  </div>

                  <span
                    className={[
                      "self-start inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold",
                      getFeelingBadgeClass(item.feeling),
                    ].join(" ")}
                  >
                    {getFeelingEmoji(item.feeling)} {item.feeling}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[24px] border border-[#dbe6f5] md:block">
            <table className="w-full border-collapse bg-white text-left">
              <thead className="bg-[#f8fbff]">
                <tr className="border-b border-[#dbe6f5]">
                  <th className="w-1/4 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>
                  <th className="w-1/4 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="w-1/4 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="w-1/4 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    Feeling
                  </th>
                </tr>
              </thead>

              <tbody>
                {pagedFeelings.map((item) => (
                  <tr
                    key={item.moneyFeelingSubmissionId}
                    className="border-b border-[#edf2f7] transition last:border-b-0 hover:bg-[#f8fbff]"
                  >
                    <td className="px-4 py-2.5 align-middle text-[14px] font-semibold text-[#0f172a]">
                      {item.fullName}
                    </td>

                    <td className="px-4 py-2.5 align-middle text-[13px] text-slate-500 break-all">
                      {item.email}
                    </td>

                    <td className="whitespace-nowrap px-4 py-2.5 align-middle">
                      <p className="text-[13px] font-medium text-slate-600">
                        {formatLocalDate(item.submittedDate)}
                      </p>
                      <p className="text-[12px] text-slate-400">
                        {formatLocalTime(item.submittedDate)}
                      </p>
                    </td>

                    <td className="px-4 py-2.5 align-middle">
                      <span
                        className={[
                          "inline-flex rounded-full border px-2.5 py-0.5 text-[12px] font-semibold",
                          getFeelingBadgeClass(item.feeling),
                        ].join(" ")}
                      >
                        {getFeelingEmoji(item.feeling)} {item.feeling}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[13px] text-slate-500">
                Page {currentPage} of {totalPages} &mdash; {feelings.length} total
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d9e3f3] bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  )
                  .reduce<(number | "…")[]>((acc, page, idx, arr) => {
                    if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) {
                      acc.push("…");
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "…" ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-[13px] text-slate-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCurrentPage(item as number)}
                        className={[
                          "inline-flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition",
                          currentPage === item
                            ? "bg-[#2563eb] text-white shadow-sm"
                            : "border border-[#d9e3f3] bg-white text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d9e3f3] bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminCard>
  );
}
