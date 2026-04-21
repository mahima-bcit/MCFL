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
            if (!await _context.CashInCategories.AnyAsync())
            {
                _context.CashInCategories.AddRange(
                    new CashInCategory { CategoryName = "Paycheck", IsActive = true, SortOrder = 1 },
                    new CashInCategory { CategoryName = "Gift", IsActive = true, SortOrder = 2 },
                    new CashInCategory { CategoryName = "Allowance/Parents", IsActive = true, SortOrder = 3 },
                    new CashInCategory { CategoryName = "Other", IsActive = true, SortOrder = 4 }
                );
            }

            if (!await _context.CashOutCategories.AnyAsync())
            {
                _context.CashOutCategories.AddRange(
                    new CashOutCategory { CategoryName = "Have", IsActive = true, SortOrder = 1 },
                    new CashOutCategory { CategoryName = "Need", IsActive = true, SortOrder = 2 },
                    new CashOutCategory { CategoryName = "Fun", IsActive = true, SortOrder = 3 },
                    new CashOutCategory { CategoryName = "Save", IsActive = true, SortOrder = 4 }
                );
            }

            await _context.SaveChangesAsync();
        }
    }
}