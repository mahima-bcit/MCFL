using System.ComponentModel.DataAnnotations;

namespace MCFL.API.DTOs.GameMoney;

public class SaveFeelingRequest
{
    [Required]
    [MaxLength(20)]
    public string Feeling { get; set; } = string.Empty;
}