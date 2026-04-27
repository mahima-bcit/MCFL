import { apiFetch } from "./apiClient";
import type { DashboardData } from "../types/dashboard";

export function getDashboardSummary(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/dashboard/summary");
}