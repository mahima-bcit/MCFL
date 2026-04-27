using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Users;
using MCFL.API.DTOs.Feedbacks;

namespace MCFL.API.Services
{
    public interface IAdminService
    {
        Task<AdminOverviewDto> GetOverviewAsync(string? range, DateTime? startDate, DateTime? endDate);
        Task<List<AdminUserListItemDto>> GetUsersAsync();
        Task<AdminUserDetailDto?> GetUserByIdAsync(string userId);
        Task<List<AdminParentFeedbackDto>> GetParentFeedbacksAsync(string? childName);
    }
}
