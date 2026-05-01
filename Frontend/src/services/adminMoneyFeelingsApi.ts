import { apiFetch } from "./apiClient";
import type { AdminMoneyFeelingItem } from "../types/adminMoneyFeelings";

export type AdminMoneyFeelingsFilters = {
  feeling?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
};

export function getAdminMoneyFeelings(
  filters: AdminMoneyFeelingsFilters = {}
): Promise<AdminMoneyFeelingItem[]> {
  const params = new URLSearchParams();

  if (filters.feeling) {
    params.set("feeling", filters.feeling);
  }

  if (filters.email) {
    params.set("email", filters.email);
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  const query = params.toString();

  return apiFetch<AdminMoneyFeelingItem[]>(
    `/admin/money-feelings${query ? `?${query}` : ""}`
  );
}
