using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Users;

namespace MCFL.API.Services
{
    public interface IAdminService
    {
        Task<AdminOverviewDto> GetOverviewAsync(string? range, DateTime? startDate, DateTime? endDate);
        Task<List<AdminUserListItemDto>> GetUsersAsync();
        Task<AdminUserDetailDto?> GetUserByIdAsync(string userId);
    }
}
