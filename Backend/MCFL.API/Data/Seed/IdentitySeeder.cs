using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace MCFL.API.Data.Seed
{
    public class IdentitySeeder : IAlwaysSeeder
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public IdentitySeeder(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task SeedAsync()
        {
            var adminEmail = _configuration["SeedAdmin:Email"];
            var adminPassword = _configuration["SeedAdmin:Password"];

            if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
            {
                return;
            }

            var existingAdmin = await _userManager.FindByEmailAsync(adminEmail);

            if (existingAdmin != null)
            {
                return;
            }

            var adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                ParentConsentRequired = false,
                ParentConsentReceived = false,
                OnboardingCompleted = true,
                MustChangePassword = true
            };

            var result = await _userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
}