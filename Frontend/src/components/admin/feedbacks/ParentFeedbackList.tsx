import { type FormEvent } from "react";
import {
  CalendarDays,
  Download,
  Filter,
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
  onApplyFilters: () => void;
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApplyFilters();
  }

  return (
    <AdminCard className="p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="shrink-0 text-[#2563eb]" />
            <h2 className="text-[20px] font-semibold text-[#0f172a]">
              Parent Feedback Submissions
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <p className="rounded-full border border-[#dbe6f5] bg-[#f8fbff] px-3 py-1.5 text-center text-[13px] font-semibold text-slate-600">
            {feedback.length === 1
              ? "1 submission"
              : `${feedback.length} submissions`}
          </p>

          <button
            type="button"
            onClick={() => exportFeedbacksCsv(feedback)}
            disabled={feedback.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Feedback</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-[20px] border border-[#dbe6f5] bg-[#f5f8fc] p-3 md:p-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="child-name-filter"
              className="mb-2 block text-[13px] font-semibold text-slate-600"
            >
              Filter by child name
            </label>

            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="child-name-filter"
                type="text"
                value={filters.childName ?? ""}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    childName: event.target.value,
                  })
                }
                placeholder="Search child name..."
                className="w-full rounded-2xl border border-[#d9e3f3] bg-white py-2.5 pl-10 pr-3 text-[15px] text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] sm:flex-none"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dbe6f5] bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff]"
              >
                <X size={16} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {loading && (
        <p className="mt-5 rounded-2xl border border-[#dbe6f5] bg-[#f8fbff] p-4 text-[14px] text-slate-600">
          Loading parent feedback...
        </p>
      )}

      {!loading && feedback.length === 0 && (
        <div className="mt-5 rounded-[24px] border border-dashed border-[#cbd8ea] bg-[#f8fbff] p-6 text-center">
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
        <div className="mt-5 space-y-4">
          {feedback.map((item) => (
            <article
              key={item.parentFeedbackId}
              className="rounded-[24px] border border-[#dbe6f5] bg-[#f8fbff] p-4 transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] md:p-5"
            >
              <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.4fr_auto] xl:items-start">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Child Name
                  </p>
                  <p className="mt-1 break-words text-[17px] font-semibold text-[#0f172a]">
                    {item.childName}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Parent Name
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[15px] font-medium text-[#0f172a]">
                    <User size={15} className="shrink-0 text-slate-400" />
                    <span className="break-words">{item.parentName}</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Email
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-600">
                    <Mail size={15} className="shrink-0 text-slate-400" />
                    <span className="break-all">{item.parentEmail}</span>
                  </div>
                </div>

                <div className="shrink-0 xl:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Submitted At
                  </p>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-[#dbe6f5] bg-white px-3 py-1.5 text-[13px] font-medium text-slate-500">
                    <CalendarDays size={14} />
                    <span>{item.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-[#dbe6f5] bg-white p-4">
                  <h4 className="text-[13px] font-semibold text-[#0f172a]">
                    Money Story
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-slate-600">
                    {item.moneyStory}
                  </p>
                </section>

                <section className="rounded-2xl border border-[#dbe6f5] bg-white p-4">
                  <h4 className="text-[13px] font-semibold text-[#0f172a]">
                    Learning
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