import type {
  AdminManageScenario,
  AdminScenarios,
  AdminUpsertScenarioRequest,
} from "../types/adminScenarios";
import { apiFetch } from "./apiClient";

export async function getAdminScenarios(): Promise<AdminScenarios> {
  return apiFetch<AdminScenarios>("/admin/scenarios");
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