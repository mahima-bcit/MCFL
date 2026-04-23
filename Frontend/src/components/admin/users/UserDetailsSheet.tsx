import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function UserDetailsSheet({
  open,
  title,
  subtitle,
  onClose,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex flex-col bg-white">
        <div className="sticky top-0 z-10 border-b border-[#dbe6f5] bg-white/95 backdrop-blur">
          <div className="flex items-start justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <p className="truncate text-[20px] font-semibold text-[#0f172a]">
                {title}
              </p>

              {subtitle ? (
                <p className="mt-1 break-all text-[13px] text-slate-500">
                  {subtitle}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#dbe6f5] bg-[#f5f8fc] text-[20px] font-semibold text-slate-700 transition hover:bg-[#edf3fd]"
              aria-label="Close details"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}