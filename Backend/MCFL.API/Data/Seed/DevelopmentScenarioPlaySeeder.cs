using MCFL.API.Models;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentScenarioPlaySeeder : IDevelopmentSeeder
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DevelopmentScenarioPlaySeeder(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            var scenarios = await _context.Scenarios
                .Include(x => x.ScenarioChoices)
                .ToListAsync();

            if (!scenarios.Any())
            {
                return;
            }

            var emails = new[] { "mahima@mcfl.local", "susie@mcfl.local", "saman@mcfl.local" };

            foreach (var email in emails)
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null) continue;

                var hasPlays = await _context.ScenarioPlays.AnyAsync(x => x.UserId == user.Id);
                if (hasPlays) continue;

                foreach (var scenario in scenarios.Take(2))
                {
                    var choice = await _context.ScenarioChoices
                        .Where(x => x.ScenarioId == scenario.ScenarioId)
                        .OrderBy(x => x.SortOrder)
                        .FirstOrDefaultAsync();

                    if (choice == null) continue;

                    _context.ScenarioPlays.Add(new ScenarioPlay
                    {
                        PlayedAt = DateTime.UtcNow.AddDays(-2),
                        GameMoneyBefore = 100.00m,
                        GameMoneyAfter = 100.00m + choice.MoneyImpact,
                        ConfidenceBefore = 60,
                        ConfidenceAfter = 60 + choice.ConfidenceImpact,
                        LessonTextSnapshot = choice.LessonText,
                        MoneyImpactSnapshot = choice.MoneyImpact,
                        ConfidenceImpactSnapshot = choice.ConfidenceImpact,
                        UserId = user.Id,
                        ScenarioId = scenario.ScenarioId,
                        ScenarioChoiceId = choice.ScenarioChoiceId
                    });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
