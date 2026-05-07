using MCFL.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class LookupSeeder : IAlwaysSeeder
    {
        private readonly AppDbContext _context;

        public LookupSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            await SeedCashInCategoriesAsync();
            await SeedCashOutCategoriesAsync();
            await SeedUserFeedbackTypesAsync();
            await SeedMoneyFeelingTypesAsync();
            await SeedBeliefDefinitionsAsync();

            await _context.SaveChangesAsync();
        }

        private async Task SeedCashInCategoriesAsync()
        {
            if (!await _context.CashInCategories.AnyAsync())
            {
                _context.CashInCategories.AddRange(
                    new CashInCategory { CategoryName = "Paycheck", IsActive = true, SortOrder = 1 },
                    new CashInCategory { CategoryName = "Gift", IsActive = true, SortOrder = 2 },
                    new CashInCategory { CategoryName = "Allowance/Parents", IsActive = true, SortOrder = 3 },
                    new CashInCategory { CategoryName = "Other", IsActive = true, SortOrder = 4 }
                );
            }
        }

        private async Task SeedCashOutCategoriesAsync()
        {
            if (!await _context.CashOutCategories.AnyAsync())
            {
                _context.CashOutCategories.AddRange(
                    new CashOutCategory { CategoryName = "Want", IsActive = true, SortOrder = 1 },
                    new CashOutCategory { CategoryName = "Need", IsActive = true, SortOrder = 2 },
                    new CashOutCategory { CategoryName = "Fun", IsActive = true, SortOrder = 3 },
                    new CashOutCategory { CategoryName = "Save", IsActive = true, SortOrder = 4 }
                );
            }
            else
            {
                // Rename legacy "Have" category to "Want" if it still exists
                var haveCategory = await _context.CashOutCategories
                    .FirstOrDefaultAsync(c => c.CategoryName == "Have");
                if (haveCategory != null)
                {
                    haveCategory.CategoryName = "Want";
                }
            }
        }

        private async Task SeedUserFeedbackTypesAsync()
        {
            var feedbackTypes = new[]
            {
                new UserFeedbackType { Name = "General", IsActive = true, SortOrder = 1 },
                new UserFeedbackType { Name = "Bug Report", IsActive = true, SortOrder = 2 },
                new UserFeedbackType { Name = "Feature Idea", IsActive = true, SortOrder = 3 },
                new UserFeedbackType { Name = "Scenario", IsActive = true, SortOrder = 4 },
                new UserFeedbackType { Name = "Others", IsActive = true, SortOrder = 5 }
            };

            foreach (var feedbackType in feedbackTypes)
            {
                var existingType = await _context.UserFeedbackTypes
                    .FirstOrDefaultAsync(x => x.Name.ToLower() == feedbackType.Name.ToLower());

                if (existingType == null)
                {
                    _context.UserFeedbackTypes.Add(feedbackType);
                }
                else
                {
                    existingType.IsActive = feedbackType.IsActive;
                    existingType.SortOrder = feedbackType.SortOrder;
                }
            }
        }

        private async Task SeedMoneyFeelingTypesAsync()
        {
            var feelings = new[]
            {
                new MoneyFeelingType { Name = "Good", IsActive = true, SortOrder = 1 },
                new MoneyFeelingType { Name = "Unsure", IsActive = true, SortOrder = 2 },
                new MoneyFeelingType { Name = "Worried", IsActive = true, SortOrder = 3 }
            };

            foreach (var feeling in feelings)
            {
                var existing = await _context.MoneyFeelingTypes
                    .FirstOrDefaultAsync(x => x.Name.ToLower() == feeling.Name.ToLower());

                if (existing == null)
                {
                    _context.MoneyFeelingTypes.Add(feeling);
                }
                else
                {
                    existing.IsActive = feeling.IsActive;
                    existing.SortOrder = feeling.SortOrder;
                }
            }
        }

        private async Task SeedBeliefDefinitionsAsync()
        {
            var beliefs = new[]
            {
                new BeliefDefinition { Key = "moneyIsGood",            Label = "Money is good",                                        SortOrder = 1, IsActive = true },
                new BeliefDefinition { Key = "moneyIsBad",             Label = "Money is bad",                                         SortOrder = 2, IsActive = true },
                new BeliefDefinition { Key = "likeHavingMoney",        Label = "I like having money",                                   SortOrder = 3, IsActive = true },
                new BeliefDefinition { Key = "likeDoingThingsForFree", Label = "I like doing things for free",                          SortOrder = 4, IsActive = true },
                new BeliefDefinition { Key = "loveSpendingMoney",      Label = "I love spending money",                                 SortOrder = 5, IsActive = true },
                new BeliefDefinition { Key = "parentsGiveMeMoney",     Label = "My parents give me money",                              SortOrder = 6, IsActive = true },
                new BeliefDefinition { Key = "dontNeedMoney",          Label = "I don't need money",                                    SortOrder = 7, IsActive = true },
                new BeliefDefinition { Key = "likeHelpingOthers",      Label = "I like helping others, they don't have to pay me",      SortOrder = 8, IsActive = true },
            };

            foreach (var belief in beliefs)
            {
                var existing = await _context.BeliefDefinitions
                    .FirstOrDefaultAsync(x => x.Key == belief.Key);

                if (existing == null)
                {
                    _context.BeliefDefinitions.Add(belief);
                }
                else
                {
                    existing.Label = belief.Label;
                    existing.SortOrder = belief.SortOrder;
                    existing.IsActive = belief.IsActive;
                }
            }
        }
    }
}
