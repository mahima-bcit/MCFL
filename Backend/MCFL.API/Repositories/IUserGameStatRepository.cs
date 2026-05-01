using MCFL.API.Models;

namespace MCFL.API.Repositories
{
    public interface IUserGameStatRepository
    {
        Task<UserGameStat?> GetByUserId(string userId);
        Task Update(UserGameStat stat);
        Task Add(UserGameStat stat);
    }
}