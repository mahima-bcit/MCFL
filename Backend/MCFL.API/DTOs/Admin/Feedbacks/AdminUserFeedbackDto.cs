namespace MCFL.API.DTOs.Admin.Feedbacks
{
    public class AdminUserFeedbackDto
    {
        public int UserFeedbackId { get; set; }
        public string UserId { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string FeedbackType { get; set; } = "";
        public string Comment { get; set; } = "";
        public string SubmittedDate { get; set; } = "";
    }
}
