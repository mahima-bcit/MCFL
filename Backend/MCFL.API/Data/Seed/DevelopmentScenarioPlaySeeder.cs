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
                .OrderBy(x => x.ScenarioId)
                .ToListAsync();

            if (!scenarios.Any())
            {
                return;
            }

            var playSeedData = new[]
            {
                new
                {
                    Email = "mahima@mcfl.local",
                    StartOffsetDays = 20,
                    InitialGameMoney = 150.00m,
                    InitialConfidence = 72,
                    ChoiceRanks = new[] { 0, 0, 1 }
                },
                new
                {
                    Email = "susie@mcfl.local",
                    StartOffsetDays = 15,
                    InitialGameMoney = 140.00m,
                    InitialConfidence = 68,
                    ChoiceRanks = new[] { 1, 0, 1 }
                },
                new
                {
                    Email = "saman@mcfl.local",
                    StartOffsetDays = 10,
                    InitialGameMoney = 100.00m,
                    InitialConfidence = 60,
                    ChoiceRanks = new[] { 99, 1, 99 }
                },
                new
                {
                    Email = "harry@mcfl.local",
                    StartOffsetDays = 8,
                    InitialGameMoney = 95.00m,
                    InitialConfidence = 58,
                    ChoiceRanks = new[] { 1, 99, 1 }
                },
                new
                {
                    Email = "amrit@mcfl.local",
                    StartOffsetDays = 5,
                    InitialGameMoney = 165.00m,
                    InitialConfidence = 67,
                    ChoiceRanks = new[] { 0, 1, 0 }
                }
            };

            foreach (var seed in playSeedData)
            {
                var user = await _userManager.FindByEmailAsync(seed.Email);
                if (user == null) continue;

                var hasPlays = await _context.ScenarioPlays.AnyAsync(x => x.UserId == user.Id);
                if (hasPlays) continue;

                var stat = await _context.UserGameStats
                    .FirstOrDefaultAsync(x => x.UserId == user.Id);

                var activeGoal = await _context.LearningSavingsGoals
                    .Where(x => x.UserId == user.Id && x.IsActive)
                    .OrderByDescending(x => x.CreatedAt)
                    .FirstOrDefaultAsync();

                decimal currentGameMoney = stat?.CurrentGameMoney ?? seed.InitialGameMoney;
                int currentConfidence = stat?.CurrentConfidenceScore ?? seed.InitialConfidence;
                decimal positiveMoneyTotal = 0.00m;
                DateTime lastPlayedAt = DateTime.UtcNow;

                var totalPlays = Math.Min(scenarios.Count, seed.ChoiceRanks.Length);

                for (var i = 0; i < totalPlays; i++)
                {
                    var scenario = scenarios[i];

                    var orderedChoices = scenario.ScenarioChoices
                        .Where(x => x.IsActive)
                        .OrderByDescending(x => x.ConfidenceImpact)
                        .ThenByDescending(x => x.MoneyImpact)
                        .ThenBy(x => x.SortOrder)
                        .ToList();

                    if (!orderedChoices.Any())
                    {
                        continue;
                    }

                    var requestedRank = seed.ChoiceRanks[i];
                    ScenarioChoice choice;

                    if (requestedRank == 99)
                    {
                        choice = orderedChoices.Last();
                    }
                    else
                    {
                        var safeIndex = Math.Min(requestedRank, orderedChoices.Count - 1);
                        choice = orderedChoices[safeIndex];
                    }

                    var playedAt = DateTime.UtcNow.Date.AddDays(-seed.StartOffsetDays + i);

                    var gameMoneyBefore = currentGameMoney;
                    var gameMoneyAfter = Math.Max(0.00m, gameMoneyBefore + choice.MoneyImpact);

                    var confidenceBefore = currentConfidence;
                    var confidenceAfter = Math.Clamp(confidenceBefore + choice.ConfidenceImpact, 0, 100);

                    _context.ScenarioPlays.Add(new ScenarioPlay
                    {
                        PlayedAt = playedAt,
                        GameMoneyBefore = gameMoneyBefore,
                        GameMoneyAfter = gameMoneyAfter,
                        ConfidenceBefore = confidenceBefore,
                        ConfidenceAfter = confidenceAfter,
                        LessonTextSnapshot = choice.LessonText,
                        MoneyImpactSnapshot = choice.MoneyImpact,
                        ConfidenceImpactSnapshot = choice.ConfidenceImpact,
                        UserId = user.Id,
                        ScenarioId = scenario.ScenarioId,
                        ScenarioChoiceId = choice.ScenarioChoiceId
                    });

                    currentGameMoney = gameMoneyAfter;
                    currentConfidence = confidenceAfter;
                    lastPlayedAt = playedAt;

                    if (choice.MoneyImpact > 0)
                    {
                        positiveMoneyTotal += choice.MoneyImpact;
                    }
                }

                if (stat == null)
                {
                    _context.UserGameStats.Add(new UserGameStat
                    {
                        UserId = user.Id,
                        CurrentGameMoney = currentGameMoney,
                        CurrentConfidenceScore = currentConfidence,
                        UpdatedAt = lastPlayedAt.AddMinutes(10)
                    });
                }
                else
                {
                    stat.CurrentGameMoney = currentGameMoney;
                    stat.CurrentConfidenceScore = currentConfidence;
                    stat.UpdatedAt = lastPlayedAt.AddMinutes(10);
                }

                if (activeGoal != null)
                {
                    activeGoal.CurrentSavedAmount = Math.Min(activeGoal.TargetAmount, positiveMoneyTotal);
                    activeGoal.UpdatedAt = lastPlayedAt.AddMinutes(10);
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
