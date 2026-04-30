using System.ComponentModel.DataAnnotations;

namespace MCFL.API.DTOs.Admin.AdminSettings
{
    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = "";

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = "";

        [Required]
        [Compare(nameof(NewPassword), ErrorMessage = "New password and confirm password do not match.")]
        public string ConfirmNewPassword { get; set; } = "";
    }
}
