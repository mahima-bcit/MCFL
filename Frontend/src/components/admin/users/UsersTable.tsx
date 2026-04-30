import { useRef, useState, type FormEvent } from "react";
import type {
  AdminUserDetail,
  AdminUserListItem,
} from "../../../types/adminUsers";
import { getAdminUserById } from "../../../services/adminUsersApi";
import type { AdminUsersFilters } from "../../../services/adminUsersApi";
import UserDetailsPanel from "./UserDetailsPanel";
import UserDetailsSheet from "./UserDetailsSheet";
import AdminCard from "../ui/AdminCard";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Mail,
  Search,
  Users,
  X,
} from "lucide-react";

type Props = {
  users: AdminUserListItem[];
  filters: AdminUsersFilters;
  loading: boolean;
  onFiltersChange: (filters: AdminUsersFilters) => void;
  onApplyFilters: (activeFilters?: AdminUsersFilters) => void;
  onClearFilters: () => void;
};

export default function UsersTable({
  users,
  filters,
  loading,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: Props) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [sheetUserId, setSheetUserId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, AdminUserDetail>>({});
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});

  const hasActiveFilters = Boolean(filters.search?.trim());
  const mobileSearchTimeoutRef = useRef<number | null>(null);

  function isMobileView() {
    return typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false;
  }

  function handleSearchChange(value: string) {
    const updatedFilters = {
      ...filters,
      search: value,
    };

    onFiltersChange(updatedFilters);

    if (!isMobileView()) {
      return;
    }

    if (mobileSearchTimeoutRef.current) {
      window.clearTimeout(mobileSearchTimeoutRef.current);
    }

    mobileSearchTimeoutRef.current = window.setTimeout(() => {
      onApplyFilters(updatedFilters);
    }, 350);
  }

  function handleMobileClearSearch() {
    const clearedFilters: AdminUsersFilters = {};

    onFiltersChange(clearedFilters);
    onApplyFilters(clearedFilters);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApplyFilters();
  }

  function isDesktopViewport() {
    return typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1280px)").matches
      : false;
  }

  async function ensureUserDetails(userId: string) {
    if (details[userId]) return true;
    if (loadingUserId === userId) return false;

    setLoadingUserId(userId);

    setDetailErrors((prev) => {
      if (!prev[userId]) return prev;

      const next = { ...prev };
      delete next[userId];
      return next;
    });

    try {
      const result = await getAdminUserById(userId);
      setDetails((prev) => ({ ...prev, [userId]: result }));
      return true;
    } catch (error) {
      setDetailErrors((prev) => ({
        ...prev,
        [userId]:
          error instanceof Error
            ? error.message
            : "Failed to load user details.",
      }));
      return false;
    } finally {
      setLoadingUserId((current) => (current === userId ? null : current));
    }
  }

  async function handleToggle(userId: string) {
    if (isDesktopViewport() && expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    const loaded = await ensureUserDetails(userId);

    if (!loaded) {
      return;
    }

    if (isDesktopViewport()) {
      setExpandedUserId(userId);
      return;
    }

    setSheetUserId(userId);
  }

  const sheetUser = sheetUserId ? details[sheetUserId] : null;

  return (
    <>
      <AdminCard className="p-5 md:p-6">
        <div className="mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Users size={20} className="shrink-0 text-[#2563eb]" />
                <h2 className="text-[20px] font-semibold text-[#0f172a]">
                  All Users
                </h2>
              </div>

              <p className="mt-1 text-[14px] text-slate-500">
                {loading
                  ? "Loading users..."
                  : hasActiveFilters
                    ? `${users.length} matching ${users.length === 1 ? "user" : "users"}`
                    : `${users.length} registered ${users.length === 1 ? "user" : "users"}`}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#10b981] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0ea56f]"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export Users</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="user-search-filter"
                type="text"
                value={filters.search ?? ""}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search user name or email..."
                className="w-full rounded-2xl border border-[#d9e3f3] bg-white py-3 pl-12 pr-12 text-[15px] text-[#0f172a] outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleMobileClearSearch}
                  aria-label="Clear user search"
                  className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-slate-600 md:hidden"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hidden items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex md:min-w-[120px]"
            >
              <Search size={18} />
              <span>Apply</span>
            </button>

            <button
              type="button"
              onClick={onClearFilters}
              disabled={!hasActiveFilters || loading}
              className="hidden items-center justify-center gap-2 rounded-2xl border border-[#dbe6f5] bg-white px-6 py-3 text-[15px] font-semibold text-slate-500 transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex md:min-w-[120px]"
            >
              <X size={18} />
              <span>Clear</span>
            </button>
          </div>
        </form>

        {loading ? (
          <div className="rounded-[22px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-5 py-8 text-center">
            <p className="text-[15px] font-semibold text-[#0f172a]">
              Loading users...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#dbe6f5] bg-[#f8fbff] px-5 py-8 text-center">
            <p className="text-[15px] font-semibold text-[#0f172a]">
              No users found
            </p>
            <p className="mt-1 text-[14px] text-slate-500">
              Try changing or clearing the name/email search.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden rounded-[18px] border border-[#dbe6f5] bg-[#f5f8fc] px-5 py-3 xl:grid xl:grid-cols-[1.6fr_1.45fr_1fr_0.9fr_0.8fr] xl:items-center xl:gap-4">
              {[
                "User",
                "Parent / Guardian",
                "DOB / Age",
                "Join Date",
                "Details",
              ].map((heading) => (
                <div
                  key={heading}
                  className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                >
                  {heading}
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              {users.map((user) => {
                const isExpanded = expandedUserId === user.userId;

                return (
                  <div
                    key={user.userId}
                    className="overflow-hidden rounded-[24px] border border-[#dbe6f5] bg-white transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                  >
                    <div className="p-4 md:p-5">
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1.45fr_1fr_0.9fr_0.8fr] xl:items-center xl:gap-4">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:hidden">
                            User
                          </p>
                          <p className="text-[18px] font-semibold text-[#0f172a]">
                            {user.fullName}
                          </p>

                          <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-600">
                            <Mail
                              size={14}
                              className="shrink-0 text-slate-400"
                            />
                            <span className="break-all">{user.email}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:hidden">
                            Parent / Guardian
                          </p>
                          <p className="text-[18px] font-semibold text-[#0f172a]">
                            {user.parentGuardianName}
                          </p>

                          <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-600">
                            <Mail
                              size={14}
                              className="shrink-0 text-slate-400"
                            />
                            <span className="break-all">
                              {user.parentGuardianEmail}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:hidden">
                            DOB / Age
                          </p>
                          <p className="text-[15px] font-medium text-[#0f172a]">
                            {user.dobAge}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:hidden">
                            Join Date
                          </p>
                          <div className="flex items-center gap-2 text-[15px] font-medium text-[#0f172a]">
                            <CalendarDays
                              size={15}
                              className="text-slate-400"
                            />
                            <span>{user.joinDate}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:hidden">
                            Details
                          </p>
                          <button
                            type="button"
                            onClick={() => handleToggle(user.userId)}
                            className="inline-flex items-center gap-2 rounded-full border border-[#dbe6f5] bg-[#f5f8fc] px-4 py-2 text-[14px] font-semibold text-[#2563eb] transition hover:border-[#c9daf3] hover:bg-[#edf3fd]"
                          >
                            <Eye size={15} />
                            <span>
                              {loadingUserId === user.userId
                                ? "Loading..."
                                : isExpanded
                                  ? "Hide"
                                  : "View"}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={15} />
                            ) : (
                              <ChevronDown size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {detailErrors[user.userId] && (
                      <div className="border-t border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {detailErrors[user.userId]}
                      </div>
                    )}

                    {isExpanded && details[user.userId] && (
                      <div className="hidden border-t border-[#dbe6f5] p-4 md:p-5 xl:block">
                        <UserDetailsPanel user={details[user.userId]} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </AdminCard>

      <UserDetailsSheet
        open={!!sheetUser}
        onClose={() => setSheetUserId(null)}
        title={sheetUser?.fullName ?? ""}
        subtitle={sheetUser?.email ?? ""}
      >
        {sheetUser ? <UserDetailsPanel user={sheetUser} /> : null}
      </UserDetailsSheet>
    </>
  );
}
