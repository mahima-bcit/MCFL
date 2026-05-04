namespace MCFL.API.DTOs.Admin.Feelings
{
    public class AdminMoneyFeelingDto
    {
        public int MoneyFeelingSubmissionId { get; set; }
        public string UserId { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Feeling { get; set; } = "";
        public string SubmittedDate { get; set; } = "";
    }
}
