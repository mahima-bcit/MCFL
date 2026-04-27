import { apiFetch } from "./apiClient";
import type {
  CreateRealMoneyEntryRequest,
  RealMoneyEntry,
  RealMoneySummary,
} from "../types/realMoney";

export function getRealMoneySummary(): Promise<RealMoneySummary> {
  return apiFetch<RealMoneySummary>("/real-money/summary");
}

export function createRealMoneyEntry(
  request: CreateRealMoneyEntryRequest
): Promise<RealMoneyEntry> {
  return apiFetch<RealMoneyEntry>("/real-money/entries", {
    method: "POST",
    body: JSON.stringify(request),
  });
}