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

export type AdminManageScenarioChoice = {
  scenarioChoiceId: number;
  optionText: string;
  resultText: string;
  lessonText?: string;
  moneyImpact: number;
  confidenceImpact: number;
  sortOrder: number;
  isActive: boolean;
};

export type AdminManageScenario = {
  scenarioId: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  choices: AdminManageScenarioChoice[];
};

export type AdminUpsertScenarioChoiceRequest = {
  scenarioChoiceId?: number;
  optionText: string;
  resultText: string;
  lessonText?: string | null;
  moneyImpact: number;
  confidenceImpact: number;
};

export type AdminUpsertScenarioRequest = {
  title: string;
  description: string;
  choices: AdminUpsertScenarioChoiceRequest[];
};