using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models;

public class BeliefDefinition
{
    public int BeliefDefinitionId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Key { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Label { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;
}
