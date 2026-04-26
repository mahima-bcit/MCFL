using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Scenarios;
using MCFL.API.DTOs.Admin.Users;

namespace MCFL.API.Services
{
    public interface IAdminService
    {
        Task<AdminOverviewDto> GetOverviewAsync(string? range, DateTime? startDate, DateTime? endDate);
        Task<List<AdminUserListItemDto>> GetUsersAsync();
        Task<AdminUserDetailDto?> GetUserByIdAsync(string userId);

        Task<AdminScenariosDto> GetScenariosAsync();

        Task<List<AdminManageScenarioDto>> GetManageScenariosAsync();
        Task<AdminManageScenarioDto> CreateScenarioAsync(AdminUpsertScenarioRequestDto request);
        Task<AdminManageScenarioDto?> UpdateScenarioAsync(int scenarioId, AdminUpsertScenarioRequestDto request);
        Task<bool> ActivateScenarioAsync(int scenarioId);
        Task<bool> DeactivateScenarioAsync(int scenarioId);
    }
}
