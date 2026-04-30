import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import DashboardTabs from "./DashboardTabs";
import { useTheme } from "../../context/ThemeContext";
import "../../DashboardPage.css";

const LOGO_SRC = "/MCFL.png";

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-inner">
        <div className="dashboard-header-top">
          <Link to="/" className="dashboard-brand">
            <div className="dashboard-brand-logo">
              {!logoBroken ? (
                <img
                  src={LOGO_SRC}
                  alt="Money Confidence for Life"
                  className="dashboard-brand-logo-image"
                  onError={() => setLogoBroken(true)}
                />
              ) : (
                <span className="dashboard-brand-logo-fallback">MC</span>
              )}
            </div>

            <div className="dashboard-brand-text">
              <h1>
                <span className="lg:hidden">MCFL</span>
                <span className="hidden lg:inline">
                  Money Confidence for Life
                </span>
              </h1>
              <p>Level Up Your Future</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
            >
              {isDark ? <Sun size={15} strokeWidth={2.2} /> : <Moon size={15} strokeWidth={2.2} />}
            </button>

            <Link
              to="/login"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 lg:w-auto lg:gap-2 lg:px-4 lg:py-2"
            >
              <LogOut size={15} strokeWidth={2.2} />
              <span className="hidden lg:inline text-[14px] font-semibold">
                Logout
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Desktop tab row */}
        <div className="hidden py-0 lg:block">
          <DashboardTabs />
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 py-3 lg:hidden">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <DashboardTabs
                orientation="vertical"
                onNavigate={() => setMobileMenuOpen(false)}
              />

              <div className="mt-2 border-t border-white/15 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-white/20"
                >
                  <LogOut size={15} strokeWidth={2.2} />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
