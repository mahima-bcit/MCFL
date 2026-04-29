import type { AdminUserDetail, AdminUserListItem } from "../types/adminUsers";
import { apiFetch } from "./apiClient";

export function getAdminUsers(): Promise<AdminUserListItem[]> {
  return apiFetch<AdminUserListItem[]>("/admin/users");
}

export function getAdminUserById(id: string): Promise<AdminUserDetail> {
  return apiFetch<AdminUserDetail>(`/admin/users/${id}`);
}