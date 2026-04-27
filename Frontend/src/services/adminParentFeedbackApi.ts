import type { AdminParentFeedback } from "../types/adminParentFeedback";
import { apiFetch } from "./apiClient";

export type AdminParentFeedbackFilters = {
  childName?: string;
};

export function getAdminParentFeedbacks(
  filters: AdminParentFeedbackFilters = {},
): Promise<AdminParentFeedback[]> {
  const params = new URLSearchParams();

  if (filters.childName?.trim()) {
    params.set("childName", filters.childName.trim());
  }

  const queryString = params.toString();

  return apiFetch<AdminParentFeedback[]>(
    `/admin/parent-feedbacks${queryString ? `?${queryString}` : ""}`,
  );
}