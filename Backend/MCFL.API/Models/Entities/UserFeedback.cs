using MCFL.API.Models.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("UserFeedback")]
    public class UserFeedback
    {
        [Key]
        [Column("pkUserFeedbackId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserFeedbackId { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("feedbackType")]
        public string FeedbackType { get; set; } = null!;

        [Required]
        [Column("comment", TypeName = "TEXT")]
        public string Comment { get; set; } = null!;

        [Column("submittedAt")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;
    }
}
