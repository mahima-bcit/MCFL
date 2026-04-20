using MCFL.API.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("UserGameStat")]
    [Index(nameof(UserId), IsUnique = true)]
    public class UserGameStat
    {
        [Key]
        [Column("pkUserGameStatId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserGameStatId { get; set; }

        [Precision(10, 2)]
        [Column("currentGameMoney")]
        public decimal CurrentGameMoney { get; set; }

        [Column("currentConfidenceScore")]
        public int CurrentConfidenceScore { get; set; }

        [Column("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;
    }
}
