using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class ScenarioPlay
    {
        [Key]
        public int ScenarioPlayId { get; set; }
        public DateTime PlayedAt { get; set; }
        public decimal GameMoneyBefore { get; set; }
        public decimal GameMoneyAfter { get; set; }
        public int ConfidenceBefore { get; set; }
        public int ConfidenceAfter { get; set; }
        public string LessonTextSnapshot { get; set; } = null!;
        public decimal MoneyImpactSnapshot { get; set; }
        public int ConfidenceImpactSnapshot { get; set; }
        public string UserId { get; set; } = null!;
        public int ScenarioId { get; set; }
        public int ScenarioChoiceId { get; set; }
    }
}
