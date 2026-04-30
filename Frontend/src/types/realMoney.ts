export type EntryType = "cashIn" | "cashOut";

export type CashInCategory = "Paycheck" | "Gift" | "Allowance / Parents" | "Allowance/Parents" | "Other";

export type CashOutCategory = "Want" | "Have" | "Need" | "Fun" | "Save";

export type RealMoneyEntry = {
  id: number;
  type: EntryType;
  amount: number;
  category: CashInCategory | CashOutCategory | string;
  comment: string;
  createdAt: string;
};

export type RealMoneySummary = {
  totalCashIn: number;
  totalCashOut: number;
  net: number;
  entries: RealMoneyEntry[];
};

export type CreateRealMoneyEntryRequest = {
  type: EntryType;
  amount: number;
  category: CashInCategory | CashOutCategory;
  comment: string;
};