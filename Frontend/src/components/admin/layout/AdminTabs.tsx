import { NavLink } from "react-router-dom";
import { LayoutDashboard, Target, Users } from "lucide-react";

type Props = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

const tabs = [
  { label: "Overview", to: "/admin/overview", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Scenarios", to: "/admin/scenarios", icon: Target },
];

export default function AdminTabs({
  orientation = "horizontal",
  onNavigate,
}: Props) {
  const isVertical = orientation === "vertical";

  return (
    <nav className={isVertical ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium transition-all duration-200",
                isVertical ? "w-full justify-start" : "",
                isActive
                  ? "bg-[#2563eb] text-white shadow-[0_6px_16px_rgba(37,99,235,0.22)]"
                  : "border border-[#d9e3f3] bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")
            }
          >
            <Icon size={16} strokeWidth={2} />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}