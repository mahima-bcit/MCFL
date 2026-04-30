import type { AdminUserDetail, AdminUserListItem } from "../types/adminUsers";
import { apiFetch } from "./apiClient";

export type AdminUsersFilters = {
  search?: string;
};

export function getAdminUsers(
  filters: AdminUsersFilters = {},
): Promise<AdminUserListItem[]> {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  const queryString = params.toString();

  return apiFetch<AdminUserListItem[]>(
    `/admin/users${queryString ? `?${queryString}` : ""}`,
  );
}

export function getAdminUserById(id: string): Promise<AdminUserDetail> {
  return apiFetch<AdminUserDetail>(`/admin/users/${id}`);
}