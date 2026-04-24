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
    <AdminCard className={`p-3.5 md:p-6 ${className}`}>
      <div
        className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl md:mb-4 md:h-11 md:w-11 md:rounded-2xl ${iconBgClassName}`}
      >
        <Icon size={16} className={iconTextClassName} />
      </div>

      <p className="text-[12px] font-medium text-slate-500 md:text-[14px]">
        {label}
      </p>

      <p className="mt-2 text-[18px] font-bold leading-none text-[#0f172a] md:mt-4 md:text-[30px]">
        {value}
      </p>
    </AdminCard>
  );
}