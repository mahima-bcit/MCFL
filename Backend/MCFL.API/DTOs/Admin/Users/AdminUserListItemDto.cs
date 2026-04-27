namespace MCFL.API.DTOs.Admin.Users
{
    public class AdminUserListItemDto
    {
        public string UserId { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string ParentGuardianName { get; set; } = "";
        public string ParentGuardianEmail { get; set; } = "";
        public string DobAge { get; set; } = "";
        public string JoinDate { get; set; } = "";
        public int Confidence { get; set; }
        public decimal GameMoney { get; set; }
        public decimal GoalProgress { get; set; }
        public int ScenariosCompleted { get; set; }
    }
}
