using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("UserBelief")]
    [Index(nameof(UserProfileId), nameof(BeliefKey), IsUnique = true)]
    public class UserBelief
    {
        [Key]
        [Column("pkUserBeliefId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserBeliefId { get; set; }

        [Required]
        [Column("fkUserProfileId")]
        public int UserProfileId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("beliefKey")]
        public string BeliefKey { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        [Column("answer")]
        public string Answer { get; set; } = null!;

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(UserProfileId))]
        public UserProfile UserProfile { get; set; } = null!;
    }
}
