import type { AdminOverview, OverviewRangeKey } from "../types/adminOverview";

const API_BASE = "https://localhost:7211/api";

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

  const response = await fetch(`${API_BASE}/admin/overview?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch admin overview");
  }

  return response.json();
}