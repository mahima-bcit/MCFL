import type { GameMoneyRecentScenario } from "./gameMoney";

export type GameMoneyPicture = {
  want: number;
  need: number;
  fun: number;
  save: number;
};

export type RealMoneySnapshot = {
  availableBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNet: number;
};

export type DashboardData = {
  featuredTitle: string;
  featuredDescription: string;

  gameBalance: number;
  confidence: number;

  goalCurrent: number;
  goalTarget: number;
  goalDueLabel: string;
  goalTitle: string;

  monthlyNet: number;
  gameMoneyPicture: GameMoneyPicture;
  realMoneySnapshot: RealMoneySnapshot;

  parentFeedback: {
    name: string;
    link: string;
  };

  recentScenario?: GameMoneyRecentScenario | null;
};