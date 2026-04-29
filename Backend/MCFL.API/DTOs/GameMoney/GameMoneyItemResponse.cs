namespace MCFL.API.DTOs.GameMoney;

public class GameMoneyItemResponse
{
    public int Id { get; set; }

    public string Category { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Note { get; set; } = string.Empty;
}