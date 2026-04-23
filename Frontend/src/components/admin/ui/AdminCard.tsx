import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AdminCard({ children, className = "" }: Props) {
  return (
    <div
      className={[
        "rounded-[24px] border border-[#dbe6f5] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.04)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}