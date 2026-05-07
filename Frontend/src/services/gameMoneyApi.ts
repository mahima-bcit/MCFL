import { apiFetch } from "./apiClient";
import type {
  GameMoneySummary,
  SaveGameMoneyFeelingRequest,
} from "../types/gameMoney";

export function getGameMoneySummary(): Promise<GameMoneySummary> {
  return apiFetch<GameMoneySummary>("/game-money/summary");
}

export function getMoneyFeelings(): Promise<string[]> {
  return apiFetch<string[]>("/game-money/feelings");
}

export function saveGameMoneyFeeling(
  request: SaveGameMoneyFeelingRequest
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/game-money/feeling", {
    method: "POST",
    body: JSON.stringify(request),
  });
}