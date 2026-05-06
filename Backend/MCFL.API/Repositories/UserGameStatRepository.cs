using MCFL.API.Data;
using MCFL.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Repositories
{
    public class UserGameStatRepository : IUserGameStatRepository
    {
        private readonly AppDbContext _context;

        public UserGameStatRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserGameStat?> GetByUserId(string userId)
        {
            return await _context.UserGameStats
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task Update(UserGameStat stat)
        {
            _context.UserGameStats.Update(stat);
            await _context.SaveChangesAsync();
        }

        public async Task Add(UserGameStat stat)
        {
            _context.UserGameStats.Add(stat);
            await _context.SaveChangesAsync();
        }
    }
}