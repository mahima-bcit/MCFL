using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCFL.API.Models.Identity
{
    public class ApplicationUser : IdentityUser
    {
        [Column("isActive")]
        public bool IsActive { get; set; } = true;

        [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Add any app-specific user properties
        [NotMapped]
        public string? FullName { get; set; }
    }
}
