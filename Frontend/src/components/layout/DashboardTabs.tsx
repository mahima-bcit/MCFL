import { NavLink } from "react-router-dom";
import { Gamepad2, LayoutDashboard, MessageCircle, Wallet } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

const tabs = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/game-zone", label: "Game Zone", icon: Gamepad2 },
  { to: "/real-money", label: "Real Money", icon: Wallet },
  { to: "/feedback", label: "Share Feedback", icon: MessageCircle },
];

export default function DashboardTabs({
  orientation = "horizontal",
  onNavigate,
}: Props) {
  const isVertical = orientation === "vertical";
  const { isDark } = useTheme();

  const activeClass = "bg-white text-[#154f3d] shadow-[0_4px_14px_rgba(0,0,0,0.18)]";
  const inactiveLight = "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20";
  const inactiveDark  = "border text-[#a0d4bc] hover:text-white";

  return (
    <nav className={isVertical ? "flex flex-col gap-1" : "flex flex-wrap gap-2"}>
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          style={({ isActive }) =>
            !isActive && isDark
              ? { background: "#1e3d2e", borderColor: "#2d5a44" }
              : {}
          }
          className={({ isActive }) =>
            [
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-200",
              isVertical ? "w-full justify-start rounded-xl py-3 gap-3" : "",
              isActive
                ? activeClass
                : isDark ? inactiveDark : inactiveLight,
            ].join(" ")
          }
        >
          <Icon size={isVertical ? 16 : 15} strokeWidth={2.2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
