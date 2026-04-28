namespace MCFL.API.DTOs.RealMoney;

public class RealMoneySummaryResponse
{
    public decimal TotalCashIn { get; set; }

    public decimal TotalCashOut { get; set; }

    public decimal Net { get; set; }

    public List<RealMoneyEntryResponse> Entries { get; set; } = [];
}