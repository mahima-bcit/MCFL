import type {
  AdminManageScenario,
  AdminScenarios,
  AdminUpsertScenarioRequest,
} from "../types/adminScenarios";
import type { OverviewRangeKey } from "../types/adminOverview";
import { apiFetch } from "./apiClient";

type GetAdminScenariosParams = {
  range?: OverviewRangeKey;
  startDate?: string;
  endDate?: string;
};

export async function getAdminScenarios(params?: GetAdminScenariosParams): Promise<AdminScenarios> {
  const query = new URLSearchParams();
  if (params?.range) query.set("range", params.range);
  if (params?.range === "custom" && params.startDate && params.endDate) {
    query.set("startDate", params.startDate);
    query.set("endDate", params.endDate);
  }
  const qs = query.toString();
  return apiFetch<AdminScenarios>(`/admin/scenarios${qs ? `?${qs}` : ""}`);
}

export async function getManageScenarios(): Promise<AdminManageScenario[]> {
  return apiFetch<AdminManageScenario[]>("/admin/scenarios/manage");
}

export async function createAdminScenario(
  payload: AdminUpsertScenarioRequest
): Promise<AdminManageScenario> {
  return apiFetch<AdminManageScenario>("/admin/scenarios/manage", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminScenario(
  scenarioId: number,
  payload: AdminUpsertScenarioRequest
): Promise<AdminManageScenario> {
  return apiFetch<AdminManageScenario>(`/admin/scenarios/manage/${scenarioId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deactivateAdminScenario(
  scenarioId: number
): Promise<void> {
  return apiFetch<void>(`/admin/scenarios/manage/${scenarioId}`, {
    method: "DELETE",
  });
}

export async function activateAdminScenario(
  scenarioId: number
): Promise<void> {
  return apiFetch<void>(`/admin/scenarios/manage/${scenarioId}/activate`, {
    method: "POST",
  });
}