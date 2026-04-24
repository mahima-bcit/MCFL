import type { AdminOverview, OverviewRangeKey } from "../types/adminOverview";
import { apiFetch } from "./apiClient";

type GetAdminOverviewParams = {
  range: OverviewRangeKey;
  startDate?: string;
  endDate?: string;
};

export async function getAdminOverview({
  range,
  startDate,
  endDate,
}: GetAdminOverviewParams): Promise<AdminOverview> {
  const params = new URLSearchParams();
  params.set("range", range);

  if (range === "custom" && startDate && endDate) {
    params.set("startDate", startDate);
    params.set("endDate", endDate);
  }

  return apiFetch<AdminOverview>(`/admin/overview?${params.toString()}`);
}