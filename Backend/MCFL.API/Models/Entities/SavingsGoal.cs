using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class SavingsGoal
    {
        [Key]
        public int SavingsGoalId { get; set; }
        public string GoalTitle { get; set; } = null!;
        public decimal TargetAmount { get; set; }
        public decimal CurrentSavedAmount { get; set; }
        public DateTime TargetDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserId { get; set; } = null!;

    }
}
