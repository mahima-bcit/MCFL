using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class ScenarioChoice
    {
        [Key]
        public int ScenarioChoiceId { get; set; }
        public int OptionText { get; set; }
        public string ResultText { get; set; } = null!;
        public string LessonText { get; set; } = null!;
        public decimal MoneyImpact { get; set; }
        public int ConfidenceImpact { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public int ScenarioId { get; set; }
    }
}
