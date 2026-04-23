export type UserGrowthPoint = {
  label: string;
  value: number;
};

export type OverviewRangeKey =
  | "today"
  | "yesterday"
  | "last7Days"
  | "last30Days"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "allTime"
  | "custom";

export type AdminOverview = {
  rangeKey: OverviewRangeKey;
  dateFrom: string;
  dateTo: string;
  totalUsers: number;
  avgConfidence: number;
  avgSavings: number;
  scenariosCompleted: number;
  decisionQuality: number;
  userGrowthSeries: UserGrowthPoint[];
};