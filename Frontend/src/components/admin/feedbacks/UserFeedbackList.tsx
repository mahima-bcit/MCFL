import { useState, type FormEvent } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Filter,
  Mail,
  MessageSquareText,
  Search,
  X,
} from "lucide-react";
import type { AdminUserFeedbackItem } from "../../../types/adminUserFeedback";
import type { AdminUserFeedbackFilters } from "../../../services/adminUserFeedbackApi";
import AdminCard from "../ui/AdminCard";

type Props = {
  feedback: AdminUserFeedbackItem[];
  feedbackTypes: string[];
  filters: AdminUserFeedbackFilters;
  filterError: string;
  loading: boolean;
  onFiltersChange: (filters: AdminUserFeedbackFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
};

function escapeCsvValue(value: string | number) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function UserFeedbackList({
  feedback,
  feedbackTypes,
  filters,
  filterError,
  loading,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: Props) {
  const hasActiveFilters =
    Boolean(filters.feedbackType) ||
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
    if (feedback.length === 0) return;

    const headers = [
      "Name",
      "Email",
      "Feedback Type",
      "Comment",
      "Submitted Date",
    ];

    const rows = feedback.map((item) => [
      item.fullName,
      item.email,
      item.feedbackType,
      item.comment,
      item.submittedDate,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "user-feedback.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApplyFilters();
  }

  function getTodayDateString() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getFeedbackTypeBadgeClass(type: string) {
    const normalizedType = type.trim().toLowerCase();

    switch (normalizedType) {
      case "bug report":
        return "bg-red-100 text-red-700 border-red-200";

      case "feature idea":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "scenario":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "general":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "others":
        return "bg-amber-100 text-amber-700 border-amber-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <AdminCard className="p-5 md:p-6">
      <div className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <MessageSquareText
                size={20}
                className="mt-1 shrink-0 text-[#2563eb]"
              />
              <h2 className="text-[22px] font-semibold leading-tight text-[#0f172a] md:text-[20px]">
                User Feedback Submissions
              </h2>
            </div>

            <p className="mt-2 text-[14px] text-slate-500">
              {loading
                ? "Loading feedback..."
                : `${feedback.length} submitted ${
                    feedback.length === 1 ? "feedback" : "feedbacks"
                  }`}
            </p>
          </div>

          {/* Desktop export button */}
          <button
            type="button"
            onClick={handleExport}
            disabled={feedback.length === 0}
            className="hidden items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
          >
            <Download size={16} />
            <span>Export Feedback</span>
          </button>
        </div>
      </div>

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
          disabled={feedback.length === 0}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={17} />
          <span>Export</span>
        </button>
      </div>

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

        <div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-slate-600">
                Type
              </label>
              <select
                value={filters.feedbackType ?? ""}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    feedbackType: event.target.value || undefined,
                  })
                }
                className="h-11 w-full rounded-2xl border border-[#d9e3f3] bg-white px-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All types</option>
                {feedbackTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
        </div>
      </form>

      {loading ? (
        <div className="rounded-[22px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-5 py-8 text-center">
          <p className="text-[15px] font-semibold text-[#0f172a]">
            Loading user feedback...
          </p>
        </div>
      ) : feedback.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-5 py-8 text-center">
          <p className="text-[15px] font-semibold text-[#0f172a]">
            No feedback found
          </p>
          <p className="mt-1 text-[14px] text-slate-500">
            Try changing or clearing the selected filters.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 md:hidden">
            {feedback.map((item) => (
              <article
                key={item.userFeedbackId}
                className="rounded-[24px] border border-[#dbe6f5] bg-[#f8fbff] p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[16px] font-semibold text-[#0f172a]">
                        {item.fullName}
                      </h3>

                      <span
                        className={[
                          "inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold",
                          getFeedbackTypeBadgeClass(item.feedbackType),
                        ].join(" ")}
                      >
                        {item.feedbackType}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-600">
                      <Mail size={14} className="shrink-0 text-slate-400" />
                      <span className="break-all">{item.email}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500">
                    <CalendarDays
                      size={14}
                      className="shrink-0 text-slate-400"
                    />
                    <span>{item.submittedDate}</span>
                  </div>
                </div>

                <p className="mt-4 text-[15px] leading-7 text-slate-700">
                  {item.comment}
                </p>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-[24px] border border-[#dbe6f5] md:block">
            <table className="w-full border-collapse bg-white text-left">
              <thead className="bg-[#f8fbff]">
                <tr className="border-b border-[#dbe6f5]">
                  <th className="w-[24%] px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>
                  <th className="w-[14%] px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="w-[14%] px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>
                  <th className="px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                    Feedback
                  </th>
                </tr>
              </thead>

              <tbody>
                {feedback.map((item) => (
                  <tr
                    key={item.userFeedbackId}
                    className="border-b border-[#edf2f7] transition last:border-b-0 hover:bg-[#f8fbff]"
                  >
                    <td className="px-5 py-4 align-top">
                      <p className="text-[15px] font-semibold text-[#0f172a]">
                        {item.fullName}
                      </p>
                      <p className="mt-1 break-all text-[14px] text-slate-500">
                        {item.email}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 align-top text-[14px] font-medium text-slate-600">
                      {item.submittedDate}
                    </td>

                    <td className="px-5 py-4 align-top">
                      <span
                        className={[
                          "inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold",
                          getFeedbackTypeBadgeClass(item.feedbackType),
                        ].join(" ")}
                      >
                        {item.feedbackType}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <p className="line-clamp-3 text-[14px] leading-6 text-slate-700">
                        {item.comment}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminCard>
  );
}
