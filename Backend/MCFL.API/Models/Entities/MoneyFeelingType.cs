using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models;

public class MoneyFeelingType
{
    public int MoneyFeelingTypeId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int SortOrder { get; set; }
}
