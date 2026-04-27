import { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminTabs from "./AdminTabs";
import { Menu, Settings, X } from "lucide-react";

export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-[#dbe6f5] bg-white/95 backdrop-blur lg:sticky lg:top-0 lg:z-40">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex items-center justify-between py-3">
          <div>
            <h1 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-[#0f172a] md:text-[28px]">
              Admin Dashboard
            </h1>
            <p className="mt-0.5 text-[13px] text-slate-500 md:text-[14px]">
              Money Confidence for Life Analytics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#f5f8fc] text-slate-600 transition hover:bg-[#edf3fd] lg:inline-flex"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>

            <NavLink
              to="/"
              className="hidden items-center rounded-full border border-[#dbe6f5] bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff] sm:inline-flex"
            >
              Back to Site
            </NavLink>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dbe6f5] bg-[#f5f8fc] text-slate-700 transition hover:bg-[#edf3fd] lg:hidden"
              aria-label="Open admin menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div className="hidden py-2 lg:block">
          <AdminTabs />
        </div>

        {menuOpen && (
          <div className="border-t border-[#dbe6f5] py-3 lg:hidden">
            <div className="rounded-2xl border border-[#dbe6f5] bg-[#f5f8fc] p-3 shadow-sm">
              <AdminTabs
                orientation="vertical"
                onNavigate={() => setMenuOpen(false)}
              />

              <div className="mt-3 pt-3">
                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#dbe6f5] bg-white px-4 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-[#f8fbff]"
                >
                  Back to Site
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
