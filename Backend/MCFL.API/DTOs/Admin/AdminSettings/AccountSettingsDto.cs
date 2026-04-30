namespace MCFL.API.DTOs.Admin.AdminSettings
{
    public class AccountSettingsDto
    {
        public string Email { get; set; } = "";
        public bool MustChangePassword { get; set; }
    }
}
