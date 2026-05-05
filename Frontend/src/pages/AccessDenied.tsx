import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

type Props = { unauthenticated?: boolean };

export default function AccessDenied({ unauthenticated = false }: Props) {
  const role = localStorage.getItem("role") ?? sessionStorage.getItem("role");

  const backTo = unauthenticated
    ? "/login"
    : role === "Admin"
      ? "/admin/overview"
      : "/dashboard";

  const backLabel = unauthenticated
    ? "Log in"
    : role === "Admin"
      ? "Go to Admin Dashboard"
      : "Go to Dashboard";

  const subtitle = unauthenticated
    ? "You need to log in to view this page."
    : "You don't have permission to view this page.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-mint px-4">
      <div className="w-full max-w-md animate-fade-up text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <ShieldX size={32} className="text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-nav mb-2">Access Denied</h1>
          <p className="text-nav/60 text-sm mb-6">{subtitle}</p>
          <Link
            to={backTo}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17875f]"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
