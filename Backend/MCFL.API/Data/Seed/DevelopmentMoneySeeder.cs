using MCFL.API.Models;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentMoneySeeder : IDevelopmentSeeder
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DevelopmentMoneySeeder(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            var cashInPaycheck = await _context.CashInCategories
                .FirstOrDefaultAsync(x => x.CategoryName == "Paycheck");

            var cashInGift = await _context.CashInCategories
                .FirstOrDefaultAsync(x => x.CategoryName == "Gift");

            var cashInAllowance = await _context.CashInCategories
                .FirstOrDefaultAsync(x => x.CategoryName == "Allowance/Parents");

            var cashOutHave = await _context.CashOutCategories
                .FirstOrDefaultAsync(x => x.CategoryName == "Have");

            var cashOutNeed = await _context.CashOutCategories
                .FirstOrDefaultAsync(x => x.CategoryName == "Need");

            var cashOutFun = await _context.CashOutCategories
                .FirstOrDefaultAsync(x => x.CategoryName == "Fun");

            var cashOutSave = await _context.CashOutCategories
                .FirstOrDefaultAsync(x => x.CategoryName == "Save");

            if (cashInPaycheck == null ||
                cashInGift == null ||
                cashInAllowance == null ||
                cashOutHave == null ||
                cashOutNeed == null ||
                cashOutFun == null ||
                cashOutSave == null)
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
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    continue;
                }

                var hasEntries = await _context.MoneyEntries.AnyAsync(x => x.UserId == user.Id);
                if (!hasEntries)
                {
                    _context.MoneyEntries.AddRange(
                        new MoneyEntry
                        {
                            EntryType = "CashIn",
                            Amount = 120.00m,
                            Comment = "Allowance from parents",
                            CreatedAt = DateTime.UtcNow.AddDays(-10),
                            UserId = user.Id,
                            CashInCategoryId = cashInAllowance.CashInCategoryId,
                            CashOutCategoryId = null
                        },
                        new MoneyEntry
                        {
                            EntryType = "CashIn",
                            Amount = 75.00m,
                            Comment = "Birthday gift",
                            CreatedAt = DateTime.UtcNow.AddDays(-8),
                            UserId = user.Id,
                            CashInCategoryId = cashInGift.CashInCategoryId,
                            CashOutCategoryId = null
                        },
                        new MoneyEntry
                        {
                            EntryType = "CashIn",
                            Amount = 210.00m,
                            Comment = "Part-time paycheck",
                            CreatedAt = DateTime.UtcNow.AddDays(-6),
                            UserId = user.Id,
                            CashInCategoryId = cashInPaycheck.CashInCategoryId,
                            CashOutCategoryId = null
                        },
                        new MoneyEntry
                        {
                            EntryType = "CashOut",
                            Amount = 45.00m,
                            Comment = "Headphones",
                            CreatedAt = DateTime.UtcNow.AddDays(-5),
                            UserId = user.Id,
                            CashInCategoryId = null,
                            CashOutCategoryId = cashOutHave.CashOutCategoryId
                        },
                        new MoneyEntry
                        {
                            EntryType = "CashOut",
                            Amount = 22.50m,
                            Comment = "Lunch and transit",
                            CreatedAt = DateTime.UtcNow.AddDays(-4),
                            UserId = user.Id,
                            CashInCategoryId = null,
                            CashOutCategoryId = cashOutNeed.CashOutCategoryId
                        },
                        new MoneyEntry
                        {
                            EntryType = "CashOut",
                            Amount = 18.00m,
                            Comment = "Movie with friends",
                            CreatedAt = DateTime.UtcNow.AddDays(-2),
                            UserId = user.Id,
                            CashInCategoryId = null,
                            CashOutCategoryId = cashOutFun.CashOutCategoryId
                        },
                        new MoneyEntry
                        {
                            EntryType = "CashOut",
                            Amount = 60.00m,
                            Comment = "Moved to savings goal",
                            CreatedAt = DateTime.UtcNow.AddDays(-1),
                            UserId = user.Id,
                            CashInCategoryId = null,
                            CashOutCategoryId = cashOutSave.CashOutCategoryId
                        });
                }

                var hasFeelings = await _context.MoneyFeelingSubmissions.AnyAsync(x => x.UserId == user.Id);
                if (!hasFeelings)
                {
                    _context.MoneyFeelingSubmissions.AddRange(
                        new MoneyFeelingSubmission
                        {
                            Feeling = "Confident",
                            SubmittedAt = DateTime.UtcNow.AddDays(-6),
                            UserId = user.Id
                        },
                        new MoneyFeelingSubmission
                        {
                            Feeling = "Curious",
                            SubmittedAt = DateTime.UtcNow.AddDays(-2),
                            UserId = user.Id
                        });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
