export type AdminUserListItem = {
  userId: string;
  fullName: string;
  email: string;
  parentGuardianName: string;
  parentGuardianEmail: string;
  dobAge: string;
  joinDate: string;
  confidence: number;
  gameMoney: number;
  goalProgress: number;
  scenariosCompleted: number;
};

export type AdminUserDetail = AdminUserListItem & {
  financialStuff: Record<string, string>;
  moneyBeliefs: Record<string, string>;
  learningPreferences: Record<string, string>;
  parentTeachings: string;
  learningGoalTitle: string;
  learningGoalProgress: number;
  learningGoalTargetAmount: number;
  learningGoalTargetDate: string;
};