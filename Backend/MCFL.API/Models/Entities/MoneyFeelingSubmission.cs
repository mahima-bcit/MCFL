using MCFL.API.Models.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models
{
    [Table("MoneyFeelingSubmission")]
    public class MoneyFeelingSubmission
    {
        [Key]
        [Column("pkMoneyFeelingSubmissionId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MoneyFeelingSubmissionId { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("feeling")]
        public string Feeling { get; set; } = null!;

        [Column("submittedAt")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("fkUserId")]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;
    }
}
