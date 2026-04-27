import type { AllowedRegistrationEmail } from "../types/adminAccessControl";
import { apiFetch } from "./apiClient";

export function getAllowedRegistrationEmails(): Promise<AllowedRegistrationEmail[]> {
  return apiFetch<AllowedRegistrationEmail[]>("/admin/access-control/allowlist");
}

export function addAllowedRegistrationEmail(
  email: string,
): Promise<AllowedRegistrationEmail> {
  return apiFetch<AllowedRegistrationEmail>("/admin/access-control/allowlist", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function deleteAllowedRegistrationEmail(id: number): Promise<void> {
  return apiFetch<void>(`/admin/access-control/allowlist/${id}`, {
    method: "DELETE",
  });
}