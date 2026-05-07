export type GameMoneyCategory = "Want" | "Need" | "Fun" | "Save";

export type GameMoneyItem = {
  id: number;
  category: GameMoneyCategory;
  amount: number;
  note: string;
};

export type GameMoneyTotals = {
  have: number;
  want: number;
  need: number;
  fun: number;
  save: number;
  total: number;
};

export type GameMoneyRecentScenario = {
  title: string;
  description: string;
  moneyImpact: number;
  confidenceBoost: number;
};

export type GameMoneySummary = {
  items: GameMoneyItem[];
  totals: GameMoneyTotals;
  recentScenario?: GameMoneyRecentScenario;
};

export type SaveGameMoneyFeelingRequest = {
  feeling: string;
};