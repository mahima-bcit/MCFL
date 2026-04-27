namespace MCFL.API.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public string FeaturedTitle { get; set; } = "Try a 2-minute scenario";
    public string FeaturedDescription { get; set; } =
        "Practice a quick money decision and build confidence one small step at a time.";

    public decimal GameBalance { get; set; }
    public int Confidence { get; set; }

    public decimal GoalCurrent { get; set; }
    public decimal GoalTarget { get; set; }
    public string GoalDueLabel { get; set; } = "No target date";

    public decimal MonthlyNet { get; set; }

    public GameMoneyPictureDto GameMoneyPicture { get; set; } = new();
    public RealMoneySnapshotDto RealMoneySnapshot { get; set; } = new();
    public ParentFeedbackLinkDto ParentFeedback { get; set; } = new();
    public RecentScenarioDto RecentScenario { get; set; } = new();
}

public class GameMoneyPictureDto
{
    public decimal Want { get; set; }
    public decimal Need { get; set; }
    public decimal Fun { get; set; }
    public decimal Save { get; set; }
}

public class RealMoneySnapshotDto
{
    public decimal AvailableBalance { get; set; }
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpenses { get; set; }
    public decimal MonthlyNet { get; set; }
}

public class ParentFeedbackLinkDto
{
    public string Name { get; set; } = "Student";
    public string Link { get; set; } = "";
}

public class RecentScenarioDto
{
    public string Title { get; set; } = "No scenario played yet";
    public string Description { get; set; } = "Play a scenario to see your latest result here.";
    public decimal MoneyImpact { get; set; }
    public int ConfidenceBoost { get; set; }
}