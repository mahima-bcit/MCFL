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

        [Column("parentConsentRequired")]
        public bool ParentConsentRequired { get; set; } = false;

        [Column("parentConsentReceived")]
        public bool ParentConsentReceived { get; set; } = false;

        [Column("onboardingCompleted")]
        public bool OnboardingCompleted { get; set; } = false;

        [Column("mustChangePassword")]
        public bool MustChangePassword { get; set; } = false;
    }
}