using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models.Entities
{
    [Table("LearningTopic")]
    [Index(nameof(TopicName), IsUnique = true)]
    public class LearningTopic
    {
        [Key]
        [Column("pkLearningTopicId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LearningTopicId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("topicName")]
        public string TopicName { get; set; } = null!;

        [Required]
        [Column("isActive")]
        public bool IsActive { get; set; } = true;

        [Required]
        [Column("sortOrder")]
        public int SortOrder { get; set; }

        public ICollection<UserLearningPreference> UserLearningPreferences { get; set; } = new List<UserLearningPreference>();
    }
}
