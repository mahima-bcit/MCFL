import { apiFetch } from "./apiClient";

export type ParentFeedbackTokenInfo = {
  childName: string;
};

export function resolveParentFeedbackToken(
  token: string,
): Promise<ParentFeedbackTokenInfo> {
  return apiFetch<ParentFeedbackTokenInfo>(
    `/ParentFeedback/info?token=${encodeURIComponent(token)}`,
  );
}

export function regenerateParentFeedbackToken(): Promise<{ token: string }> {
  return apiFetch<{ token: string }>("/ParentAccessLink/regenerate", {
    method: "POST",
  });
}
