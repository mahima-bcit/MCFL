import type { ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-900">
      <AdminHeader />

      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6 md:py-10">
        <main>{children}</main>
      </div>

      <AdminFooter />
    </div>
  );
}