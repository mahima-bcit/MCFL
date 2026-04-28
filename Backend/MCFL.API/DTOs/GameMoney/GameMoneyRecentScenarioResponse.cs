namespace MCFL.API.DTOs.GameMoney;

public class GameMoneyRecentScenarioResponse
{
    public string Title { get; set; } = "No scenario yet";

    public string Description { get; set; } = "Start a scenario to see your latest result.";

    public decimal MoneyImpact { get; set; }

    public int ConfidenceBoost { get; set; }
}