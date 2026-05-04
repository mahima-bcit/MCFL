import type { LucideIcon } from "lucide-react";
import AdminCard from "../ui/AdminCard";

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBgClassName?: string;
  iconTextClassName?: string;
  className?: string;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconBgClassName = "bg-[#eef4ff]",
  iconTextClassName = "text-[#2563eb]",
  className = "",
}: Props) {
  return (
    <AdminCard className={`p-3.5 md:p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg md:h-8 md:w-8 md:rounded-xl ${iconBgClassName}`}
        >
          <Icon size={14} className={`md:size-4 ${iconTextClassName}`} />
        </div>
        <p className="text-[12px] font-medium text-slate-500 md:text-[13px]">
          {label}
        </p>
      </div>

      <p className="text-[22px] font-bold leading-none text-[#0f172a] md:text-[28px]">
        {value}
      </p>
    </AdminCard>
  );
}