export type DashboardData = {
  featuredTitle: string;
  featuredDescription: string;

  gameBalance: number;
  confidence: number;

  goalCurrent: number;
  goalTarget: number;
  goalDueLabel: string;

  monthlyNet: number;

  gameMoneyPicture: {
    want: number;
    need: number;
    fun: number;
    save: number;
  };

  realMoneySnapshot: {
    availableBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyNet: number;
  };

  parentFeedback: {
    name: string;
    link: string;
  };

  recentScenario: {
    title: string;
    description: string;
    moneyImpact: number;
    confidenceBoost: number;
  };
};