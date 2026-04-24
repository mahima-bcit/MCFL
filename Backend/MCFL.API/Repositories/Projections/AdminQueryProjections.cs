namespace MCFL.API.Repositories.Projections
{
    public class AdminUserListProjection
    {
        public string UserId { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string ParentGuardianName { get; set; } = "";
        public string ParentGuardianEmail { get; set; } = "";
        public DateOnly DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Confidence { get; set; }
        public decimal GameMoney { get; set; }
        public decimal GoalProgress { get; set; }
        public int ScenariosCompleted { get; set; }
    }

    public class AdminUserDetailProjection
    {
        public string UserId { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string ParentGuardianName { get; set; } = "";
        public string ParentGuardianEmail { get; set; } = "";
        public DateOnly DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Confidence { get; set; }
        public decimal GameMoney { get; set; }
        public decimal GoalProgress { get; set; }
        public int ScenariosCompleted { get; set; }

        public bool HasBankAccount { get; set; }
        public string EarnsMoneyAnswer { get; set; } = "";
        public string HasSavingsAnswer { get; set; } = "";
        public string PaysBillsAnswer { get; set; } = "";
        public string SpendsOnWantsAnswer { get; set; } = "";

        public List<string> SelectedTopicNames { get; set; } = new();
        public string? LearningComments { get; set; }
        public string? ParentTeachingsAnswer { get; set; }

        public string LearningGoalTitle { get; set; } = "Save $300 per month";
        public decimal LearningGoalProgress { get; set; }
        public decimal LearningGoalTargetAmount { get; set; } = 300m;
        public DateOnly? LearningGoalTargetDate { get; set; }
    }

    public class AdminScenarioSummaryProjection
    {
        public int ScenarioId { get; set; }
        public string Title { get; set; } = "";
        public string MostPopularChoice { get; set; } = "";
        public int Completions { get; set; }
        public double AvgConfidenceGain { get; set; }
        public decimal AvgMoneyImpact { get; set; }
        public double PercentageOfTotal { get; set; }
    }
}
