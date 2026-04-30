import type {
  AdminAccountSettings,
  ChangeAdminPasswordRequest,
} from "../types/adminSettings";
import { apiFetch } from "./apiClient";

export function getAdminAccountSettings(): Promise<AdminAccountSettings> {
  return apiFetch<AdminAccountSettings>("account/settings");
}

export function changeAdminPassword(
  request: ChangeAdminPasswordRequest,
): Promise<void> {
  return apiFetch<void>("account/password", {
    method: "PUT",
    body: JSON.stringify(request),
  });
}