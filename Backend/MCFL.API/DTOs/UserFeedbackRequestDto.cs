using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models.DTOs;

public class UserFeedbackRequestDto
{
    [Required]
    [MaxLength(20)]
    public string FeedbackType { get; set; } = null!;

    [Required]
    public string Comment { get; set; } = null!;
}