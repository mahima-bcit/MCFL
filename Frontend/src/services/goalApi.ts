import { apiFetch } from "./apiClient";

export type CreateGoalPayload = {
  goalTitle: string;
  targetAmount: number;
  targetDate?: string; // "YYYY-MM-DD"
};

export type ActiveGoal = {
  goalId: number;
  goalTitle: string;
  targetAmount: number;
  currentSavedAmount: number;
  targetDate?: string;
  createdAt: string;
};

export function getActiveGoal(): Promise<ActiveGoal | null> {
  return apiFetch<ActiveGoal | undefined>("/goals/active")
    .then((data) => data ?? null)
    .catch((err: unknown) => {
      if (err instanceof Error && err.message.includes("404")) return null;
      throw err;
    });
}

export function createGoal(payload: CreateGoalPayload): Promise<ActiveGoal> {
  return apiFetch<ActiveGoal>("/goals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
