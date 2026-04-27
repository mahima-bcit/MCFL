import { apiFetch } from "./apiClient";
import type { AdminUserFeedbackItem } from "../types/adminUserFeedback";

export type AdminUserFeedbackFilters = {
  feedbackType?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
};

export function getAdminUserFeedback(
  filters: AdminUserFeedbackFilters = {}
): Promise<AdminUserFeedbackItem[]> {
  const params = new URLSearchParams();

  if (filters.feedbackType) {
    params.set("feedbackType", filters.feedbackType);
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

  return apiFetch<AdminUserFeedbackItem[]>(
    `/admin/user-feedback${query ? `?${query}` : ""}`
  );
}

export function getAdminUserFeedbackTypes(): Promise<string[]> {
  return apiFetch<string[]>("/admin/user-feedback/types");
}