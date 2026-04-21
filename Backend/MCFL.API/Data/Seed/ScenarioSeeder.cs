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
            var now = DateTime.UtcNow;

            var scenarioDefinitions = new[]
            {
                new
                {
                    Title = "Birthday Money",
                    Description = "You received birthday money from family. What do you do with it?",
                    Choices = new[]
                    {
                        new 
                        { 
                            OptionText = "Spend all of it on something fun right away.", 
                            ResultText = "You enjoyed your money immediately, but now you have nothing left.", 
                            LessonText = "Spending can feel good in the moment, but using all your money at once can limit future choices.", 
                            MoneyImpact = -30.00m, 
                            ConfidenceImpact = 0, 
                            SortOrder = 1 
                        },
                        new 
                        { 
                            OptionText = "Save all of it for a future goal.", 
                            ResultText = "You kept the full amount for later and moved closer to your goal.", 
                            LessonText = "Saving everything can be a strong choice when you have something important planned.", 
                            MoneyImpact = 30.00m, 
                            ConfidenceImpact = 2, 
                            SortOrder = 2 
                        },
                        new 
                        { 
                            OptionText = "Split it between saving and spending.", 
                            ResultText = "You enjoyed some money now and still kept part of it for later.", 
                            LessonText = "A balanced choice can help you enjoy money today while still planning ahead.", 
                            MoneyImpact = 15.00m, 
                            ConfidenceImpact = 3, 
                            SortOrder = 3 
                        }
                    }
                },
                new
                {
                    Title = "New Headphones",
                    Description = "Your headphones broke, but you were also saving for something important.",
                    Choices = new[]
                    {
                        new 
                        { 
                            OptionText = "Buy the most expensive headphones you like.", 
                            ResultText = "You got what you wanted, but it took a big bite out of your money.", 
                            LessonText = "It helps to compare needs, wants, and budget before making a big purchase.", 
                            MoneyImpact = -40.00m, 
                            ConfidenceImpact = -1, 
                            SortOrder = 1 
                        },
                        new 
                        { 
                            OptionText = "Buy a reasonably priced pair and keep saving.", 
                            ResultText = "You solved the problem and protected some of your savings.", 
                            LessonText = "Looking for a practical option can help you meet a need without losing track of your goals.", 
                            MoneyImpact = -15.00m, 
                            ConfidenceImpact = 3, 
                            SortOrder = 2 
                        },
                        new 
                        { 
                            OptionText = "Wait a little longer and research better options first.", 
                            ResultText = "You delayed the purchase and gave yourself more time to decide carefully.", 
                            LessonText = "Taking time before spending can help you make more confident money decisions.", 
                            MoneyImpact = 5.00m, 
                            ConfidenceImpact = 2, 
                            SortOrder = 3 
                        }
                    }
                },
                new
                {
                    Title = "Weekend Plan",
                    Description = "Your friends want to go out this weekend, but your budget is tight.",
                    Choices = new[]
                    {
                        new 
                        { 
                            OptionText = "Go out and spend whatever it costs.", 
                            ResultText = "You joined the plan, but now your budget is under pressure.", 
                            LessonText = "Social spending adds up quickly when there is no plan before you go.", 
                            MoneyImpact = -25.00m, 
                            ConfidenceImpact = 0, 
                            SortOrder = 1 
                        },
                        new 
                        { 
                            OptionText = "Suggest a lower-cost option everyone can enjoy.", 
                            ResultText = "You still spent time with friends while keeping your budget under control.", 
                            LessonText = "You do not always need to spend a lot to have a good time.", 
                            MoneyImpact = -10.00m, 
                            ConfidenceImpact = 4, 
                            SortOrder = 2 
                        },
                        new 
                        { 
                            OptionText = "Skip this weekend and keep your money for something more important.", 
                            ResultText = "You protected your money, though you missed out on this one event.", 
                            LessonText = "Sometimes saying no is part of staying aligned with your priorities.", 
                            MoneyImpact = 10.00m, 
                            ConfidenceImpact = 2, 
                            SortOrder = 3 
                        }
                    }
                }
            };

            foreach (var definition in scenarioDefinitions)
            {
                var scenario = await _context.Scenarios
                    .FirstOrDefaultAsync(x => x.Title == definition.Title);

                if (scenario == null)
                {
                    scenario = new Scenario
                    {
                        Title = definition.Title,
                        Description = definition.Description,
                        IsActive = true,
                        CreatedAt = now,
                        UpdatedAt = now
                    };

                    _context.Scenarios.Add(scenario);
                    await _context.SaveChangesAsync();
                }

                foreach (var choiceDef in definition.Choices)
                {
                    var existingChoice = await _context.ScenarioChoices
                        .FirstOrDefaultAsync(x =>
                            x.ScenarioId == scenario.ScenarioId &&
                            x.SortOrder == choiceDef.SortOrder);

                    if (existingChoice != null)
                    {
                        continue;
                    }

                    _context.ScenarioChoices.Add(new ScenarioChoice
                    {
                        OptionText = choiceDef.OptionText,
                        ResultText = choiceDef.ResultText,
                        LessonText = choiceDef.LessonText,
                        MoneyImpact = choiceDef.MoneyImpact,
                        ConfidenceImpact = choiceDef.ConfidenceImpact,
                        SortOrder = choiceDef.SortOrder,
                        IsActive = true,
                        ScenarioId = scenario.ScenarioId
                    });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}