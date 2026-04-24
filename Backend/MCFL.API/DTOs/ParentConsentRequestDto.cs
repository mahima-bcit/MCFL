using MCFL.API.Models.DTOs;
using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models.DTOs;

public class ParentConsentRequestDto
{
    [Required]
    [MaxLength(100)]
    public string ParentName { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string ParentEmail { get; set; } = null!;
    public string UserId { get; internal set; } = null!;
    public object ConfirmUrl { get; internal set; } = null!;
}