import type { AdminUserDetail, AdminUserListItem } from "../types/adminUsers";

const API_BASE = "https://localhost:7211/api";

export async function getAdminUsers(): Promise<AdminUserListItem[]> {
  const response = await fetch(`${API_BASE}/admin/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch admin users");
  }

  return response.json();
}

export async function getAdminUserById(id: string): Promise<AdminUserDetail> {
  const response = await fetch(`${API_BASE}/admin/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch admin user details");
  }

  return response.json();
}