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
        }

        private async Task SeedUserFeedbackTypesAsync()
        {
            var feedbackTypes = new[]
            {
                new UserFeedbackType
                {
                    Name = "General",
                    IsActive = true,
                    SortOrder = 1
                },
                new UserFeedbackType
                {
                    Name = "Bug Report",
                    IsActive = true,
                    SortOrder = 2
                },
                new UserFeedbackType
                {
                    Name = "Feature Idea",
                    IsActive = true,
                    SortOrder = 3
                },
                new UserFeedbackType
                {
                    Name = "Scenario",
                    IsActive = true,
                    SortOrder = 4
                },
                new UserFeedbackType
                {
                    Name = "Others",
                    IsActive = true,
                    SortOrder = 5
                }
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
    }
}