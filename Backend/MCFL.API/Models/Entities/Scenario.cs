using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("Scenario")]
    public class Scenario
    {
        [Key]
        [Column("pkScenarioId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScenarioId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("title")]
        public string Title { get; set; } = null!;

        [Required]
        [Column("description", TypeName = "TEXT")]
        public string Description { get; set; } = null!;

        [Column("isActive")]
        public bool IsActive { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
