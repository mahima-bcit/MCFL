using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class UserGameStat
    {
        [Key]
        public int UserGameStatId { get; set; }
        public decimal CurrentGameMoney { get; set; }
        public int CurrentConfidenceScore { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserId { get; set; } = null!;
    }
}
