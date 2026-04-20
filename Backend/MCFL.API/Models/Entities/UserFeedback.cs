using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class UserFeedback
    {
        [Key]
        public int UserFeedbackId { get; set; }
        public string FeedbackType { get; set; } = null!;
        public string Comment { get; set; } = null!;
        public DateTime SubmittedAt { get; set; }
        public string UserId { get; set; } = null!;
    }
}
