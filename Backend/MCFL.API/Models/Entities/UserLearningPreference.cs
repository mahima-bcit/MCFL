using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models.Entities
{
    [Table("UserLearningPreference")]
    [Index(nameof(UserProfileId), nameof(LearningTopicId), IsUnique = true)]
    public class UserLearningPreference
    {
        [Key]
        [Column("pkUserLearningPreferenceId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserLearningPreferenceId { get; set; }

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserProfileId")]
        public int UserProfileId { get; set; }

        [Required]
        [Column("fkLearningTopicId")]
        public int LearningTopicId { get; set; }

        [ForeignKey(nameof(UserProfileId))]
        public UserProfile UserProfile { get; set; } = null!;

        [ForeignKey(nameof(LearningTopicId))]
        public LearningTopic LearningTopic { get; set; } = null!;
    }
}
