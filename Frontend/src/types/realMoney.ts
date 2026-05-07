export type EntryType = "cashIn" | "cashOut";

export type CashInCategory = string;

export type CashOutCategory = string;

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