import { CheckCircle2, Trash2, X } from "lucide-react";

type Props = {
  open: boolean;
  mode: "activate" | "deactivate";
  scenarioTitle: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ScenarioStatusModal({
  open,
  mode,
  scenarioTitle,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  const isActivate = mode === "activate";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close confirmation"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
      />

      <div className="absolute inset-0 flex items-end justify-center p-3 sm:items-center sm:p-4">
        <div className="w-full max-w-[680px] overflow-hidden rounded-[32px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
          <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                  isActivate ? "bg-[#eafaf3]" : "bg-[#fff1f2]"
                }`}
              >
                {isActivate ? (
                  <CheckCircle2 size={24} className="text-[#10b981]" />
                ) : (
                  <Trash2 size={24} className="text-[#ef4444]" />
                )}
              </div>

              <div className="min-w-0 pt-1">
                <h3 className="text-[22px] font-semibold leading-tight text-[#1e293b]">
                  {isActivate ? "Activate scenario?" : "Deactivate scenario?"}
                </h3>

                <p className="mt-3 text-[15px] leading-8 text-slate-500 sm:text-[16px]">
                  <span className="font-semibold text-[#1e293b]">
                    {scenarioTitle}
                  </span>{" "}
                  {isActivate
                    ? "will be active again and visible in active scenario reporting."
                    : "will be inactive and hidden from active scenario reporting."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#dbe6f5] bg-[#f5f8fc] text-slate-600 transition hover:bg-[#edf3fd]"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>

          <div className="border-t border-[#dbe6f5] px-5 py-5 sm:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#dbe6f5] bg-white px-7 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[14px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isActivate
                    ? "bg-[#10b981] hover:bg-[#0ea56f]"
                    : "bg-[#ff0f23] hover:bg-[#e20c1f]"
                }`}
              >
                {isActivate ? <CheckCircle2 size={18} /> : <Trash2 size={18} />}
                <span>
                  {loading
                    ? isActivate
                      ? "Activating..."
                      : "Deactivating..."
                    : isActivate
                      ? "Confirm Activate"
                      : "Confirm Deactivate"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}