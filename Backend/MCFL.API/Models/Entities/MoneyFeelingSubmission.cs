using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class MoneyFeelingSubmission
    {
        [Key]
        public int MoneyFeelingSubmissionId { get; set; }
        public string Feeling { get; set; } = null!;
        public DateTime SubmittedAt { get; set; }
        public string UserId { get; set; } = null!;
    }
}
