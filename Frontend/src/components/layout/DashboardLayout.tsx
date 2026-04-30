import type { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardFooter from "./DashboardFooter";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <main>{children}</main>
      <DashboardFooter />
    </div>
  );
}
