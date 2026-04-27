import type { LucideIcon } from "lucide-react";
import AdminCard from "../ui/AdminCard";

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBgClassName?: string;
  iconTextClassName?: string;
  helperText?: string;
  helperTextClassName?: string;
  valueClassName?: string;
  className?: string;
};

export default function CompactScenarioStatCard({
  label,
  value,
  icon: Icon,
  iconBgClassName = "bg-[#eef4ff]",
  iconTextClassName = "text-[#2563eb]",
  helperText,
  helperTextClassName = "text-[#10b981]",
  valueClassName = "text-[#0f172a]",
  className = "",
}: Props) {
  return (
    <AdminCard className={`p-3 md:p-5 ${className}`}>
      <div
        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl md:mb-3 md:h-11 md:w-11 md:rounded-2xl ${iconBgClassName}`}
      >
        <Icon size={15} className={iconTextClassName} />
      </div>

      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 md:text-[11px]">
        {label}
      </p>

      <p
        className={`mt-1 text-[18px] font-bold leading-none md:mt-2 md:text-[30px] ${valueClassName}`}
      >
        {value}
      </p>

      {helperText ? (
        <p
          className={`mt-2 text-[11px] font-medium md:mt-3 md:text-[13px] ${helperTextClassName}`}
        >
          {helperText}
        </p>
      ) : null}
    </AdminCard>
  );
}