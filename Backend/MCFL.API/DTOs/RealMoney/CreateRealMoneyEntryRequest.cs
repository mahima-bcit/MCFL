using System.ComponentModel.DataAnnotations;

namespace MCFL.API.DTOs.RealMoney;

public class CreateRealMoneyEntryRequest
{
    [Required]
    public string Type { get; set; } = string.Empty;

    [Range(0.01, 999999)]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Comment { get; set; }
}