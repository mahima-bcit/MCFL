export type AdminMoneyFeelingItem = {
  moneyFeelingSubmissionId: number;
  userId: string;
  fullName: string;
  email: string;
  feeling: "Good" | "Unsure" | "Worried";
  submittedDate: string;
};
