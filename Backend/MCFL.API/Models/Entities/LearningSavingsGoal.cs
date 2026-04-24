using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("LearningSavingsGoal")]
    public class LearningSavingsGoal
    {
        [Key]
        [Column("pkLearningSavingsGoalId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LearningSavingsGoalId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("goalTitle")]
        public string GoalTitle { get; set; } = null!;

        [Precision(10, 2)]
        [Column("targetAmount")]
        public decimal TargetAmount { get; set; }

        [Precision(10, 2)]
        [Column("currentSavedAmount")]
        public decimal? CurrentSavedAmount { get; set; }

        [Column("targetDate", TypeName = "date")]
        public DateOnly? TargetDate { get; set; }

        [Column("isActive")]
        public bool IsActive { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

    }
}
