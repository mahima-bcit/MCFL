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
                            LessonText = (string?)"Spending can feel good in the moment, but using all your money at once can limit future choices.",
                            MoneyImpact = -30.00m,
                            ConfidenceImpact = 1,
                            SortOrder = 1
                        },
                        new
                        {
                            OptionText = "Save all of it for a future goal.",
                            ResultText = "You kept the full amount for later and moved closer to your goal.",
                            LessonText = (string?)"Saving everything can be a strong choice when you have something important planned.",
                            MoneyImpact = 30.00m,
                            ConfidenceImpact = 2,
                            SortOrder = 2
                        },
                        new
                        {
                            OptionText = "Split it between saving and spending.",
                            ResultText = "You enjoyed some money now and still kept part of it for later.",
                            LessonText = (string?)null,
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
                            LessonText = (string?)"It helps to compare needs, wants, and budget before making a big purchase.",
                            MoneyImpact = -40.00m,
                            ConfidenceImpact = 1,
                            SortOrder = 1
                        },
                        new
                        {
                            OptionText = "Buy a reasonably priced pair and keep saving.",
                            ResultText = "You solved the problem and protected some of your savings.",
                            LessonText = (string?)"Looking for a practical option can help you meet a need without losing track of your goals.",
                            MoneyImpact = -15.00m,
                            ConfidenceImpact = 3,
                            SortOrder = 2
                        },
                        new
                        {
                            OptionText = "Wait a little longer and research better options first.",
                            ResultText = "You delayed the purchase and gave yourself more time to decide carefully.",
                            LessonText = (string?)"Taking time before spending can help you make more confident money decisions.",
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
                            LessonText = (string?)"Social spending adds up quickly when there is no plan before you go.",
                            MoneyImpact = -25.00m,
                            ConfidenceImpact = 1,
                            SortOrder = 1
                        },
                        new
                        {
                            OptionText = "Suggest a lower-cost option everyone can enjoy.",
                            ResultText = "You still spent time with friends while keeping your budget under control.",
                            LessonText = (string?)"You do not always need to spend a lot to have a good time.",
                            MoneyImpact = -10.00m,
                            ConfidenceImpact = 4,
                            SortOrder = 2
                        },
                        new
                        {
                            OptionText = "Skip this weekend and keep your money for something more important.",
                            ResultText = "You protected your money, though you missed out on this one event.",
                            LessonText = (string?)null,
                            MoneyImpact = 10.00m,
                            ConfidenceImpact = 2,
                            SortOrder = 3
                        },

                    }
                },
                new
{
    Title = "Flash Sale Temptation",
    Description = "You see a limited-time sale on something you have wanted for a while.",
    Choices = new[]
    {
        new
        {
            OptionText = "Buy it immediately before the sale ends.",
            ResultText = "You grabbed the deal, but did not fully think it through.",
            LessonText = (string?)"Sales can create pressure, but it is important to decide if you truly need the item.",
            MoneyImpact = -35.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Check your budget first and decide calmly.",
            ResultText = "You made a thoughtful decision based on your finances.",
            LessonText = (string?)"Pausing before buying helps you stay in control of your money.",
            MoneyImpact = -10.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Skip the sale and keep saving.",
            ResultText = "You avoided spending and stayed focused on your goals.",
            LessonText = (string?)null,
            MoneyImpact = 15.00m,
            ConfidenceImpact = 2,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Unexpected Expense",
    Description = "You need to pay for something you did not plan for this month.",
    Choices = new[]
    {
        new
        {
            OptionText = "Use your savings to cover it.",
            ResultText = "You handled the situation, but your savings decreased.",
            LessonText = (string?)"Emergency savings can help protect you from unexpected costs.",
            MoneyImpact = -20.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Put it on a credit card.",
            ResultText = "You solved the problem now but created future debt.",
            LessonText = (string?)"Using credit without a repayment plan can lead to long-term costs.",
            MoneyImpact = -30.00m,
            ConfidenceImpact = 1,
            SortOrder = 2
        },
        new
        {
            OptionText = "Adjust your budget to cover it.",
            ResultText = "You stayed in control by reallocating your money.",
            LessonText = (string?)null,
            MoneyImpact = -10.00m,
            ConfidenceImpact = 3,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Subscription Overload",
    Description = "You notice you are paying for multiple subscriptions you barely use.",
    Choices = new[]
    {
        new
        {
            OptionText = "Ignore it since they are small charges.",
            ResultText = "The costs continue adding up over time.",
            LessonText = (string?)"Small recurring expenses can become significant over time.",
            MoneyImpact = -15.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Cancel the ones you do not use.",
            ResultText = "You reduced unnecessary spending.",
            LessonText = (string?)"Reviewing subscriptions regularly helps you stay in control of your budget.",
            MoneyImpact = 20.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Downgrade to cheaper plans.",
            ResultText = "You saved some money while keeping access.",
            LessonText = (string?)null,
            MoneyImpact = 10.00m,
            ConfidenceImpact = 2,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Helping a Friend",
    Description = "A friend asks to borrow money from you.",
    Choices = new[]
    {
        new
        {
            OptionText = "Lend the full amount without thinking.",
            ResultText = "You helped, but now your own finances are tighter.",
            LessonText = (string?)"Helping others is important, but you should not put yourself at risk.",
            MoneyImpact = -25.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Lend a smaller amount you can afford.",
            ResultText = "You helped while protecting your finances.",
            LessonText = (string?)"Setting limits can help you support others responsibly.",
            MoneyImpact = -10.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Politely decline.",
            ResultText = "You kept your finances stable, though it was a tough choice.",
            LessonText = (string?)null,
            MoneyImpact = 5.00m,
            ConfidenceImpact = 2,
            SortOrder = 3
        }
    }
},
new
{
    Title = "New Phone Upgrade",
    Description = "A new phone model just came out and your current one still works.",
    Choices = new[]
    {
        new
        {
            OptionText = "Upgrade immediately.",
            ResultText = "You got the latest tech but spent a lot.",
            LessonText = (string?)"Upgrading too often can delay bigger financial goals.",
            MoneyImpact = -50.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Wait until your current phone needs replacing.",
            ResultText = "You made the most of what you already have.",
            LessonText = (string?)"Using items longer can help you save money.",
            MoneyImpact = 20.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Look for a discounted or older model.",
            ResultText = "You upgraded while spending less.",
            LessonText = (string?)null,
            MoneyImpact = -20.00m,
            ConfidenceImpact = 2,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Food Delivery Habit",
    Description = "You have been ordering food delivery several times a week.",
    Choices = new[]
    {
        new
        {
            OptionText = "Keep ordering for convenience.",
            ResultText = "It is easy, but your spending increases.",
            LessonText = (string?)"Convenience often comes with higher costs.",
            MoneyImpact = -25.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Limit delivery to once a week.",
            ResultText = "You balanced convenience and cost.",
            LessonText = (string?)"Reducing frequency can make a big difference over time.",
            MoneyImpact = -10.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Start cooking more meals at home.",
            ResultText = "You saved money and built a new habit.",
            LessonText = (string?)null,
            MoneyImpact = 20.00m,
            ConfidenceImpact = 4,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Side Income Opportunity",
    Description = "You have a chance to earn extra money with a small side job.",
    Choices = new[]
    {
        new
        {
            OptionText = "Ignore it and relax instead.",
            ResultText = "You kept your free time but missed extra income.",
            LessonText = (string?)"Opportunities to earn extra income can help you reach goals faster.",
            MoneyImpact = 0.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Take the opportunity and save the earnings.",
            ResultText = "You increased your savings.",
            LessonText = (string?)"Additional income can strengthen your financial stability.",
            MoneyImpact = 30.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Take the job and spend the extra money.",
            ResultText = "You enjoyed the extra cash but did not save it.",
            LessonText = (string?)null,
            MoneyImpact = 10.00m,
            ConfidenceImpact = 2,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Impulse Purchase",
    Description = "You see something small at checkout that you did not plan to buy.",
    Choices = new[]
    {
        new
        {
            OptionText = "Add it to your purchase without thinking.",
            ResultText = "It seemed small, but these purchases add up.",
            LessonText = (string?)"Impulse buying can slowly reduce your available money.",
            MoneyImpact = -10.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Pause and decide if you really need it.",
            ResultText = "You made a more intentional choice.",
            LessonText = (string?)"A short pause can prevent unnecessary spending.",
            MoneyImpact = 5.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Put it back and stick to your plan.",
            ResultText = "You avoided unnecessary spending completely.",
            LessonText = (string?)null,
            MoneyImpact = 10.00m,
            ConfidenceImpact = 3,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Saving Goal Progress",
    Description = "You are getting close to reaching a savings goal.",
    Choices = new[]
    {
        new
        {
            OptionText = "Spend some of it as a reward early.",
            ResultText = "You celebrated, but delayed your goal.",
            LessonText = (string?)"Early rewards can slow long-term progress.",
            MoneyImpact = -15.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Stay focused and reach the goal first.",
            ResultText = "You achieved your goal successfully.",
            LessonText = (string?)"Consistency helps you reach financial goals faster.",
            MoneyImpact = 25.00m,
            ConfidenceImpact = 4,
            SortOrder = 2
        },
        new
        {
            OptionText = "Adjust the goal to make it easier.",
            ResultText = "You made progress but lowered your target.",
            LessonText = (string?)null,
            MoneyImpact = 5.00m,
            ConfidenceImpact = 1,
            SortOrder = 3
        }
    }
},
new
{
    Title = "Budget Tracking",
    Description = "You realize you have not been tracking your spending lately.",
    Choices = new[]
    {
        new
        {
            OptionText = "Keep going without tracking.",
            ResultText = "You may lose track of where your money is going.",
            LessonText = (string?)"Tracking helps you stay aware of your financial habits.",
            MoneyImpact = -15.00m,
            ConfidenceImpact = 1,
            SortOrder = 1
        },
        new
        {
            OptionText = "Start tracking your expenses again.",
            ResultText = "You gained better control of your finances.",
            LessonText = (string?)"Awareness is the first step to improving money habits.",
            MoneyImpact = 15.00m,
            ConfidenceImpact = 3,
            SortOrder = 2
        },
        new
        {
            OptionText = "Track only your biggest expenses.",
            ResultText = "You improved slightly but missed smaller patterns.",
            LessonText = (string?)null,
            MoneyImpact = 5.00m,
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