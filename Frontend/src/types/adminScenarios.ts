export type AdminScenarioSummary = {
  scenarioId: number;
  title: string;
  mostPopularChoice: string;
  completions: number;
  avgConfidenceGain: number;
  avgMoneyImpact: number;
  percentageOfTotal: number;
};

export type AdminScenarios = {
  totalScenarios: number;
  totalCompletions: number;
  avgConfidenceGain: number;
  avgMoneyImpact: number;
  scenarios: AdminScenarioSummary[];
};