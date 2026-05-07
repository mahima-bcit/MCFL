import { apiFetch } from "./apiClient";
import type {
  CreateRealMoneyEntryRequest,
  RealMoneyEntry,
  RealMoneySummary,
} from "../types/realMoney";

export type RealMoneyCategories = {
  cashIn: string[];
  cashOut: string[];
};

export function getRealMoneyCategories(): Promise<RealMoneyCategories> {
  return apiFetch<RealMoneyCategories>("/real-money/categories");
}

export function getRealMoneySummary(): Promise<RealMoneySummary> {
  return apiFetch<RealMoneySummary>("/real-money/summary");
}

export function getRealMoneyEntries(): Promise<RealMoneyEntry[]> {
  return apiFetch<RealMoneyEntry[]>("/real-money/entries");
}

export function createRealMoneyEntry(
  request: CreateRealMoneyEntryRequest
): Promise<RealMoneyEntry> {
  return apiFetch<RealMoneyEntry>("/real-money/entries", {
    method: "POST",
    body: JSON.stringify(request),
  });
}