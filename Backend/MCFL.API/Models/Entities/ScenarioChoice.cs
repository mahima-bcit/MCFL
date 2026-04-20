using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("ScenarioChoice")]
    public class ScenarioChoice
    {
        [Key]
        [Column("pkScenarioChoiceId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScenarioChoiceId { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("optionText")]
        public string OptionText { get; set; } = null!;

        [Required]
        [Column("resultText", TypeName = "TEXT")]
        public string ResultText { get; set; } = null!;

        [Required]
        [Column("lessonText", TypeName = "TEXT")]
        public string LessonText { get; set; } = null!;

        [Precision(10, 2)]
        [Column("moneyImpact")]
        public decimal MoneyImpact { get; set; }

        [Column("confidenceImpact")]
        public int ConfidenceImpact { get; set; }

        [Column("sortOrder")]
        public int SortOrder { get; set; }

        [Column("isActive")]
        public bool IsActive { get; set; }

        [Column("fkScenarioId")]
        public int ScenarioId { get; set; }

        [ForeignKey(nameof(ScenarioId))]
        public Scenario Scenario { get; set; } = null!;
    }
}
