import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UserGrowthPoint } from "../../../types/adminOverview";

type Props = {
  data: UserGrowthPoint[];
};

const MOBILE_PAGE_SIZE = 5;

export default function UserGrowthChart({ data }: Props) {
  const [page, setPage] = useState(1);

  const mobileItems = useMemo(() => {
    return [...data].reverse().filter((item) => item.value > 0);
  }, [data]);

  const totalPages = Math.max(
    1,
    Math.ceil(mobileItems.length / MOBILE_PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * MOBILE_PAGE_SIZE;
  const pagedItems = mobileItems.slice(
    startIndex,
    startIndex + MOBILE_PAGE_SIZE
  );

  function handlePrev() {
    setPage((prev) => Math.max(1, prev - 1));
  }

  function handleNext() {
    setPage((prev) => Math.min(totalPages, prev + 1));
  }

  return (
    <>
      {/* Mobile list */}
      <div className="space-y-2 md:hidden">
        {pagedItems.length > 0 ? (
          <>
            {pagedItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2"
              >
                <span className="text-[13px] font-medium text-slate-600">
                  {item.label}
                </span>
                <span className="text-[14px] font-semibold text-[#0f172a]">
                  {item.value} new users
                </span>
              </div>
            ))}

            {mobileItems.length > MOBILE_PAGE_SIZE && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={safePage === 1}
                  className="rounded-full border border-[#dbe6f5] bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-[12px] font-medium text-slate-500">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={safePage === totalPages}
                  className="rounded-full border border-[#dbe6f5] bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 transition hover:bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-white/70 px-3 py-3 text-[13px] text-slate-500">
            No new users in this range.
          </div>
        )}
      </div>

      {/* Tablet / desktop chart */}
      <div className="hidden h-56 md:block md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}