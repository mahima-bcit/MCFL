using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class Scenario
    {
        [Key]
        public int ScenarioId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
