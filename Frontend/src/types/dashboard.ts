export type DashboardData = {
  featuredTitle: string;
  featuredDescription: string;

  gameBalance: number;
  confidence: number;

  goalCurrent: number;
  goalTarget: number;
  goalDueLabel: string;
  goalTitle: string;

  parentFeedback: {
    name: string;
    link: string;
  };

};