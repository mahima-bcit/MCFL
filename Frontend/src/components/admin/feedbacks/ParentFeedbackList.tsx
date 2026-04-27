import { useRef, type FormEvent } from "react";
import {
  CalendarDays,
  Download,
  Mail,
  MessageSquare,
  Search,
  User,
  X,
} from "lucide-react";
import AdminCard from "../ui/AdminCard";
import type { AdminParentFeedback } from "../../../types/adminParentFeedback";
import type { AdminParentFeedbackFilters } from "../../../services/adminParentFeedbackApi";

type ParentFeedbackListProps = {
  feedback: AdminParentFeedback[];
  filters: AdminParentFeedbackFilters;
  loading: boolean;
  onFiltersChange: (filters: AdminParentFeedbackFilters) => void;
  onApplyFilters: (activeFilters?: AdminParentFeedbackFilters) => void;
  onClearFilters: () => void;
};

function escapeCsvValue(value: string | number) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function exportFeedbacksCsv(feedback: AdminParentFeedback[]) {
  const headers = [
    "Child Name",
    "Parent Name",
    "Parent Email",
    "Money Story",
    "What Child Should Learn",
    "Submitted At",
  ];

  const rows = feedback.map((item) => [
    item.childName,
    item.parentName,
    item.parentEmail,
    item.moneyStory,
    item.whatChildShouldLearn,
    item.submittedAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "parent-feedback.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export default function ParentFeedbackList({
  feedback,
  filters,
  loading,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: ParentFeedbackListProps) {
  const hasActiveFilters = Boolean(filters.childName?.trim());

  const mobileSearchTimeoutRef = useRef<number | null>(null);

  function isMobileView() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  function handleChildNameChange(value: string) {
    const updatedFilters = {
      ...filters,
      childName: value,
    };

    onFiltersChange(updatedFilters);

    if (!isMobileView()) {
      return;
    }

    if (mobileSearchTimeoutRef.current) {
      window.clearTimeout(mobileSearchTimeoutRef.current);
    }

    mobileSearchTimeoutRef.current = window.setTimeout(() => {
      onApplyFilters(updatedFilters);
    }, 350);
  }

  function handleMobileClearSearch() {
    const clearedFilters: AdminParentFeedbackFilters = {};

    onFiltersChange(clearedFilters);
    onApplyFilters(clearedFilters);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApplyFilters();
  }

  return (
    <AdminCard className="p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <MessageSquare size={24} className="shrink-0 text-[#4f00e8]" />
            <h2 className="text-[26px] font-semibold leading-tight text-[#0f172a] md:text-[24px]">
              Parent Feedback Submissions
            </h2>
          </div>

          <p className="mt-3 text-[16px] text-[#516789]">
            {feedback.length === 1
              ? "1 submitted feedback"
              : `${feedback.length} submitted feedbacks`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportFeedbacksCsv(feedback)}
          disabled={feedback.length === 0}
          className="hidden shrink-0 items-center justify-center gap-2 rounded-full bg-[#00c985] px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#00b978] disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex"
        >
          <Download size={18} />
          <span>Export Feedback</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="child-name-filter"
                  type="text"
                  value={filters.childName ?? ""}
                  onChange={(event) =>
                    handleChildNameChange(event.target.value)
                  }
                  placeholder="Search child name..."
                  className="w-full rounded-2xl border border-[#d9e3f3] bg-white py-3 pl-12 pr-12 text-[15px] text-[#0f172a] outline-none transition focus:border-[#4f00e8] focus:ring-2 focus:ring-[#4f00e8]/10"
                />

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleMobileClearSearch}
                    aria-label="Clear child name search"
                    className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-slate-600 md:hidden"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="hidden items-center justify-center gap-2 rounded-2xl bg-[#4f00e8] px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#3f00ba] md:inline-flex md:min-w-[120px]"
          >
            <Search size={18} />
            <span>Apply</span>
          </button>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="hidden items-center justify-center gap-2 rounded-2xl border border-[#dbe6f5] bg-white px-6 py-3 text-[15px] font-semibold text-slate-500 transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex md:min-w-[120px]"
          >
            <X size={18} />
            <span>Clear</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => exportFeedbacksCsv(feedback)}
          disabled={feedback.length === 0}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00c985] px-5 py-3 text-[16px] font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
        >
          <Download size={18} />
          <span>Export</span>
        </button>
      </form>

      {loading && (
        <p className="mt-6 rounded-2xl border border-[#dbe6f5] bg-[#f8fbff] p-4 text-[14px] text-slate-600">
          Loading parent feedback...
        </p>
      )}

      {!loading && feedback.length === 0 && (
        <div className="mt-6 rounded-[24px] border border-dashed border-[#cbd8ea] bg-[#f8fbff] p-6 text-center">
          <p className="text-[16px] font-semibold text-[#0f172a]">
            No parent feedback found.
          </p>
          <p className="mt-1 text-[14px] text-slate-500">
            Try clearing the child name filter or check again after parents
            submit feedback.
          </p>
        </div>
      )}

      {!loading && feedback.length > 0 && (
        <div className="mt-6 space-y-4">
          {feedback.map((item) => (
            <article
              key={item.parentFeedbackId}
              className="rounded-[24px] border border-[#dbe6f5] bg-[#f8fbff] p-4 transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] md:p-5"
            >
              <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.35fr_auto] xl:items-start">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Child Name
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[18px] font-semibold text-[#0f172a]">
                    <User size={15} className="shrink-0 text-slate-400" />
                    <span className="break-words">{item.childName}</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Parent Name
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[15px] font-medium text-[#0f172a]">
                    <User size={15} className="shrink-0 text-slate-400" />
                    <span className="break-words">{item.parentName}</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Parent Email
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[14px] text-slate-600">
                    <Mail size={15} className="shrink-0 text-slate-400" />
                    <span className="break-all">{item.parentEmail}</span>
                  </div>
                </div>

                <div className="shrink-0 xl:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Date Submitted
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 py-1.5 text-[13px] font-medium text-slate-600">
                    <CalendarDays size={14} />
                    <span>{item.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-[#dbe6f5] bg-white p-4">
                  <h4 className="text-[13px] font-semibold text-[#0f172a]">
                    Money Lesson Story
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-slate-600">
                    {item.moneyStory}
                  </p>
                </section>

                <section className="rounded-2xl border border-[#dbe6f5] bg-white p-4">
                  <h4 className="text-[13px] font-semibold text-[#0f172a]">
                    What They Want Child To Learn
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-slate-600">
                    {item.whatChildShouldLearn}
                  </p>
                </section>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminCard>
  );
}
