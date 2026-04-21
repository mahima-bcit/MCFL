using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace MCFL.API.Data.Seed
{
    public class IdentitySeeder : IAlwaysSeeder
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<IdentitySeeder> _logger;

        public IdentitySeeder(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ILogger<IdentitySeeder> logger)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            var adminEmail = _configuration["SeedAdmin:Email"];
            var adminPassword = _configuration["SeedAdmin:Password"];

            if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
            {
                return;
            }

            var adminUser = await _userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
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

                var createResult = await _userManager.CreateAsync(adminUser, adminPassword);

                if (!createResult.Succeeded)
                {
                    var errors = string.Join("; ", createResult.Errors.Select(e => $"{e.Code}: {e.Description}"));
                    _logger.LogError("Failed to create seed admin user {Email}. Errors: {Errors}", adminEmail, errors);
                    throw new InvalidOperationException($"Failed to create seed admin user '{adminEmail}': {errors}");
                }
            }
            else
            {
                adminUser.UserName = adminEmail;
                adminUser.Email = adminEmail;
                adminUser.EmailConfirmed = true;
                adminUser.IsActive = true;
                adminUser.ParentConsentRequired = false;
                adminUser.ParentConsentReceived = false;
                adminUser.OnboardingCompleted = true;
                adminUser.MustChangePassword = true;

                var updateResult = await _userManager.UpdateAsync(adminUser);

                if (!updateResult.Succeeded)
                {
                    var errors = string.Join("; ", updateResult.Errors.Select(e => $"{e.Code}: {e.Description}"));
                    _logger.LogError("Failed to update seed admin user {Email}. Errors: {Errors}", adminEmail, errors);
                    throw new InvalidOperationException($"Failed to update seed admin user '{adminEmail}': {errors}");
                }
            }

            if (!await _userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                var roleResult = await _userManager.AddToRoleAsync(adminUser, "Admin");

                if (!roleResult.Succeeded)
                {
                    var errors = string.Join("; ", roleResult.Errors.Select(e => $"{e.Code}: {e.Description}"));
                    _logger.LogError("Failed to add seed admin user {Email} to Admin role. Errors: {Errors}", adminEmail, errors);
                    throw new InvalidOperationException($"Failed to add seed admin user '{adminEmail}' to Admin role: {errors}");
                }
            }
        }
    }
}