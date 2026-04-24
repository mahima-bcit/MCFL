import type { AdminScenarios } from "../types/adminScenarios";
import { apiFetch } from "./apiClient";

export async function getAdminScenarios(): Promise<AdminScenarios> {
  return apiFetch<AdminScenarios>("/admin/scenarios");
}