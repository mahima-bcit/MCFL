using System.ComponentModel.DataAnnotations;

namespace MCFL.API.Models
{
    public class RegistrationAllowList
    {
        [Key]
        public int RegistrationAllowListId { get; set; }
        public string Email { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
