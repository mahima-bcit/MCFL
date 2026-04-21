using MCFL.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentAllowListSeeder : IDevelopmentSeeder
    {
        private readonly AppDbContext _context;

        public DevelopmentAllowListSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            if (await _context.RegistrationAllowLists.AnyAsync())
            {
                return;
            }

            var emails = new[]
            {
            "mahima@mcfl.local",
            "susie@mcfl.local",
            "saman@mcfl.local",
            "harry@mcfl.local",
            "amrit@mcfl.local"
        };

            foreach (var email in emails)
            {
                _context.RegistrationAllowLists.Add(new RegistrationAllowList
                {
                    Email = email,
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
