using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentUserSeeder : IDevelopmentSeeder
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public DevelopmentUserSeeder(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            var demoUsers = new[]
            {
            new
            {
                Email = "mahima@mcfl.local",
                Password = "Demo123!",
                Role = "User",
                IsActive = true,
                ParentConsentRequired = true,
                ParentConsentReceived = true,
                OnboardingCompleted = true
            },
            new
            {
                Email = "susie@mcfl.local",
                Password = "Demo123!",
                Role = "User",
                IsActive = true,
                ParentConsentRequired = false,
                ParentConsentReceived = false,
                OnboardingCompleted = true
            },
            new
            {
                Email = "saman@mcfl.local",
                Password = "Demo123!",
                Role = "User",
                IsActive = true,
                ParentConsentRequired = true,
                ParentConsentReceived = false,
                OnboardingCompleted = false
            },
            new
            {
                Email = "harry@mcfl.local",
                Password = "Demo123!",
                Role = "User",
                IsActive = false,
                ParentConsentRequired = false,
                ParentConsentReceived = false,
                OnboardingCompleted = true
            },
            new
            {
                Email = "amrit@mcfl.local",
                Password = "Demo123!",
                Role = "User",
                IsActive = false,
                ParentConsentRequired = true,
                ParentConsentReceived = true,
                OnboardingCompleted = false
            }
        };

            foreach (var demoUser in demoUsers)
            {
                var existingUser = await _userManager.FindByEmailAsync(demoUser.Email);

                if (existingUser != null)
                {
                    continue;
                }

                var user = new ApplicationUser
                {
                    UserName = demoUser.Email,
                    Email = demoUser.Email,
                    EmailConfirmed = true,
                    IsActive = demoUser.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    ParentConsentRequired = demoUser.ParentConsentRequired,
                    ParentConsentReceived = demoUser.ParentConsentReceived,
                    OnboardingCompleted = demoUser.OnboardingCompleted,
                    MustChangePassword = false
                };

                var result = await _userManager.CreateAsync(user, demoUser.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, demoUser.Role);
                }
            }
        }
    }
}
