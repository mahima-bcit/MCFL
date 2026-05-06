export type Scenario = {
  id: number;
  title: string;
  description: string;
  choices: ScenarioChoice[];
};

export type ScenarioChoice = {
  id: number;
  optionText: string;
  resultText: string;
  lessonText: string | null;
  moneyImpact: number;
  confidenceImpact: number;
};

export type GameState = {
  currentGameMoney: number;
  currentConfidenceScore: number;
};
