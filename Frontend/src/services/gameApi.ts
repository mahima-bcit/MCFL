import { apiFetch } from "./apiClient";
import type { Scenario, GameState } from "../types/game";

export function getUserGameStats(): Promise<GameState> {
  return apiFetch<GameState>("/UserGameStat/current");
}

export function addUserSelection(scenarioChoiceId: number): Promise<GameState> {
  return apiFetch<GameState>("/Game/choice", {
    method: "POST",
    body: JSON.stringify({ scenarioChoiceId }),
  });
}

export function getScenarios(): Promise<Scenario[]> {
  return apiFetch<Scenario[]>("/GameScenario/random");
}
