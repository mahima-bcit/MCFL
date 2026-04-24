namespace MCFL.API.DTOs.Admin.Users
{
    public class AdminUserDetailDto : AdminUserListItemDto
    {
        public Dictionary<string, string> FinancialStuff { get; set; } = new();
        public Dictionary<string, string> LearningPreferences { get; set; } = new();
        public string ParentTeachings { get; set; } = "";
        public string LearningGoalTitle { get; set; } = "";
        public decimal LearningGoalProgress { get; set; }
        public decimal LearningGoalTargetAmount { get; set; }
        public string LearningGoalTargetDate { get; set; } = "";
    }
}
