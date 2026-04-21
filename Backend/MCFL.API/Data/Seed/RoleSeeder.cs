using Microsoft.AspNetCore.Identity;

namespace MCFL.API.Data.Seed
{
    public class RoleSeeder : IAlwaysSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<RoleSeeder> _logger;

        public RoleSeeder(RoleManager<IdentityRole> roleManager, ILogger<RoleSeeder> logger)
        {
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            string[] roles = ["Admin", "User"];

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    var result = await _roleManager.CreateAsync(new IdentityRole(role));

                    if (!result.Succeeded)
                    {
                        var errors = string.Join("; ", result.Errors.Select(e => $"{e.Code}: {e.Description}"));
                        _logger.LogError("Failed to create role {Role}. Errors: {Errors}", role, errors);
                        throw new InvalidOperationException($"Failed to create role '{role}': {errors}");
                    }
                }
            }
        }
    }
}
