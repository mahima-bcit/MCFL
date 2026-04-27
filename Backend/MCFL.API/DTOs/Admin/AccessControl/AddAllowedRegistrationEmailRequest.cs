using System.ComponentModel.DataAnnotations;

namespace MCFL.API.DTOs.Admin.AccessControl
{
    public class AddAllowedRegistrationEmailRequest
    {
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = "";
    }
}
