using MCFL.API.DTOs.Admin.AccessControl;
using MCFL.API.DTOs.Admin.Feedbacks;
using MCFL.API.DTOs.Admin.Feelings;
using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Scenarios;
using MCFL.API.DTOs.Admin.Users;
using MCFL.API.DTOs.Feedbacks;

namespace MCFL.API.Services
{
    public interface IAdminService
    {
        Task<AdminOverviewDto> GetOverviewAsync(string? range, DateTime? startDate, DateTime? endDate);

        Task<List<AdminUserListItemDto>> GetUsersAsync(string? search);
        Task<AdminUserDetailDto?> GetUserByIdAsync(string userId);

        Task<List<AdminUserFeedbackDto>> GetUserFeedbackAsync(string? feedbackType, string? email, DateTime? startDate, DateTime? endDate);
        Task<List<string>> GetUserFeedbackTypesAsync();

        Task<List<AdminParentFeedbackDto>> GetParentFeedbacksAsync(string? childName);

        Task<List<AdminAllowedRegistrationEmailDto>> GetAllowedRegistrationEmailsAsync();
        Task<AdminAllowedRegistrationEmailDto> AddAllowedRegistrationEmailAsync(AddAllowedRegistrationEmailRequest request);
        Task<bool> DeleteAllowedRegistrationEmailAsync(int id);

        Task<AdminScenariosDto> GetScenariosAsync(string? range = "allTime", DateTime? startDate = null, DateTime? endDate = null);

        Task<List<AdminManageScenarioDto>> GetManageScenariosAsync();
        Task<AdminManageScenarioDto> CreateScenarioAsync(AdminUpsertScenarioRequestDto request);
        Task<AdminManageScenarioDto?> UpdateScenarioAsync(int scenarioId, AdminUpsertScenarioRequestDto request);
        Task<bool> ActivateScenarioAsync(int scenarioId);
        Task<bool> DeactivateScenarioAsync(int scenarioId);

        Task<List<AdminMoneyFeelingDto>> GetMoneyFeelingsAsync(
            string? feeling, string? email, DateTime? startDate, DateTime? endDate);
    }
}