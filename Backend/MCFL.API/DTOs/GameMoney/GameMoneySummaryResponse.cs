namespace MCFL.API.DTOs.GameMoney;

public class GameMoneySummaryResponse
{
    public List<GameMoneyItemResponse> Items { get; set; } = new();

    public GameMoneyTotalsResponse Totals { get; set; } = new();

    public GameMoneyRecentScenarioResponse RecentScenario { get; set; } = new();
}