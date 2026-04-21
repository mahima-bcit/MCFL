using MCFL.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class ScenarioSeeder : IAlwaysSeeder
    {
        private readonly AppDbContext _context;

        public ScenarioSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            if (await _context.Scenarios.AnyAsync() || await _context.ScenarioChoices.AnyAsync())
            {
                return;
            }

            var now = DateTime.UtcNow;

            var scenarios = new List<Scenario>
        {
            new Scenario
            {
                Title = "Birthday Money",
                Description = "You received birthday money from family. What do you do with it?",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Scenario
            {
                Title = "New Headphones",
                Description = "Your headphones broke, but you were also saving for something important.",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Scenario
            {
                Title = "Weekend Plan",
                Description = "Your friends want to go out this weekend, but your budget is tight.",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            }
        };

            _context.Scenarios.AddRange(scenarios);
            await _context.SaveChangesAsync();

            var birthdayMoney = scenarios[0];
            var newHeadphones = scenarios[1];
            var weekendPlan = scenarios[2];

            var choices = new List<ScenarioChoice>
        {
            // Birthday Money
            new ScenarioChoice
            {
                OptionText = "Spend all of it on something fun right away.",
                ResultText = "You enjoyed your money immediately, but now you have nothing left.",
                LessonText = "Spending can feel good in the moment, but using all your money at once can limit future choices.",
                MoneyImpact = -30.00m,
                ConfidenceImpact = 0,
                SortOrder = 1,
                IsActive = true,
                ScenarioId = birthdayMoney.ScenarioId
            },
            new ScenarioChoice
            {
                OptionText = "Save all of it for a future goal.",
                ResultText = "You kept the full amount for later and moved closer to your goal.",
                LessonText = "Saving everything can be a strong choice when you have something important planned.",
                MoneyImpact = 30.00m,
                ConfidenceImpact = 2,
                SortOrder = 2,
                IsActive = true,
                ScenarioId = birthdayMoney.ScenarioId
            },
            new ScenarioChoice
            {
                OptionText = "Split it between saving and spending.",
                ResultText = "You enjoyed some money now and still kept part of it for later.",
                LessonText = "A balanced choice can help you enjoy money today while still planning ahead.",
                MoneyImpact = 15.00m,
                ConfidenceImpact = 3,
                SortOrder = 3,
                IsActive = true,
                ScenarioId = birthdayMoney.ScenarioId
            },

            // New Headphones
            new ScenarioChoice
            {
                OptionText = "Buy the most expensive headphones you like.",
                ResultText = "You got what you wanted, but it took a big bite out of your money.",
                LessonText = "It helps to compare needs, wants, and budget before making a big purchase.",
                MoneyImpact = -40.00m,
                ConfidenceImpact = -1,
                SortOrder = 1,
                IsActive = true,
                ScenarioId = newHeadphones.ScenarioId
            },
            new ScenarioChoice
            {
                OptionText = "Buy a reasonably priced pair and keep saving.",
                ResultText = "You solved the problem and protected some of your savings.",
                LessonText = "Looking for a practical option can help you meet a need without losing track of your goals.",
                MoneyImpact = -15.00m,
                ConfidenceImpact = 3,
                SortOrder = 2,
                IsActive = true,
                ScenarioId = newHeadphones.ScenarioId
            },
            new ScenarioChoice
            {
                OptionText = "Wait a little longer and research better options first.",
                ResultText = "You delayed the purchase and gave yourself more time to decide carefully.",
                LessonText = "Taking time before spending can help you make more confident money decisions.",
                MoneyImpact = 5.00m,
                ConfidenceImpact = 2,
                SortOrder = 3,
                IsActive = true,
                ScenarioId = newHeadphones.ScenarioId
            },

            // Weekend Plan
            new ScenarioChoice
            {
                OptionText = "Go out and spend whatever it costs.",
                ResultText = "You joined the plan, but now your budget is under pressure.",
                LessonText = "Social spending adds up quickly when there is no plan before you go.",
                MoneyImpact = -25.00m,
                ConfidenceImpact = 0,
                SortOrder = 1,
                IsActive = true,
                ScenarioId = weekendPlan.ScenarioId
            },
            new ScenarioChoice
            {
                OptionText = "Suggest a lower-cost option everyone can enjoy.",
                ResultText = "You still spent time with friends while keeping your budget under control.",
                LessonText = "You do not always need to spend a lot to have a good time.",
                MoneyImpact = -10.00m,
                ConfidenceImpact = 4,
                SortOrder = 2,
                IsActive = true,
                ScenarioId = weekendPlan.ScenarioId
            },
            new ScenarioChoice
            {
                OptionText = "Skip this weekend and keep your money for something more important.",
                ResultText = "You protected your money, though you missed out on this one event.",
                LessonText = "Sometimes saying no is part of staying aligned with your priorities.",
                MoneyImpact = 10.00m,
                ConfidenceImpact = 2,
                SortOrder = 3,
                IsActive = true,
                ScenarioId = weekendPlan.ScenarioId
            }
        };

            _context.ScenarioChoices.AddRange(choices);
            await _context.SaveChangesAsync();
        }
    }
}
