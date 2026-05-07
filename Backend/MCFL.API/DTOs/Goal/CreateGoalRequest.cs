using System.ComponentModel.DataAnnotations;

namespace MCFL.API.DTOs.Goal;

public class CreateGoalRequest
{
    [Required, MaxLength(100)]
    public string GoalTitle { get; set; } = string.Empty;

    [Range(0.01, 999999)]
    public decimal TargetAmount { get; set; }

    public DateOnly? TargetDate { get; set; }
}

public class ActiveGoalResponse
{
    public int GoalId { get; set; }
    public string GoalTitle { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentSavedAmount { get; set; }
    public DateOnly? TargetDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
