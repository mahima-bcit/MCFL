namespace MCFL.API.DTOs.RealMoney;

public class RealMoneyEntryResponse
{
    public int Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Category { get; set; } = string.Empty;

    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}