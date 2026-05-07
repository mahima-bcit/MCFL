import type { ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-900 flex flex-col">
      <AdminHeader />

      <div className="flex-1 mx-auto w-full max-w-350 px-4 py-8 md:px-6 md:py-10">
        <main>{children}</main>
      </div>

      <AdminFooter />
    </div>
  );
}