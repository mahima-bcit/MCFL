using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("ScenarioPlay")]
    public class ScenarioPlay
    {
        [Key]
        [Column("pkScenarioPlayId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScenarioPlayId { get; set; }

        [Column("playedAt")]
        public DateTime PlayedAt { get; set; } = DateTime.UtcNow;

        [Precision(10, 2)]
        [Column("gameMoneyBefore")]
        public decimal GameMoneyBefore { get; set; }

        [Precision(10, 2)]
        [Column("gameMoneyAfter")]
        public decimal GameMoneyAfter { get; set; }

        [Column("confidenceBefore")]
        public int ConfidenceBefore { get; set; }

        [Column("confidenceAfter")]
        public int ConfidenceAfter { get; set; }

        [Column("lessonTextSnapshot", TypeName = "TEXT")]
        public string? LessonTextSnapshot { get; set; }

        [Precision(10, 2)]
        [Column("moneyImpactSnapshot")]
        public decimal MoneyImpactSnapshot { get; set; }

        [Column("confidenceImpactSnapshot")]
        public int ConfidenceImpactSnapshot { get; set; }

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [Column("fkScenarioId")]
        public int ScenarioId { get; set; }

        [Column("fkScenarioChoiceId")]
        public int ScenarioChoiceId { get; set; }

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        [ForeignKey(nameof(ScenarioId))]
        public Scenario Scenario { get; set; } = null!;

        [ForeignKey(nameof(ScenarioChoiceId))]
        public ScenarioChoice ScenarioChoice { get; set; } = null!;
    }
}
