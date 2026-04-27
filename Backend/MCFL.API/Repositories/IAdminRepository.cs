using MCFL.API.DTOs.Admin.Scenarios;
using MCFL.API.Models;
using MCFL.API.Repositories.Projections;

namespace MCFL.API.Repositories
{
    public interface IAdminRepository
    {
        Task<DateTime?> GetEarliestProfileCreatedAtAsync();
        Task<List<string>> GetUserIdsCreatedInRangeAsync(DateTime dateFrom, DateTime dateToExclusive);
        Task<int?> GetAverageConfidenceAsync(IReadOnlyCollection<string> userIds);
        Task<decimal> GetAverageGoalProgressAsync(IReadOnlyCollection<string> userIds);
        Task<int> CountScenarioPlaysInRangeAsync(DateTime dateFrom, DateTime dateToExclusive);
        Task<int> CountPositiveConfidenceScenarioPlaysInRangeAsync(DateTime dateFrom, DateTime dateToExclusive);
        Task<List<DateTime>> GetProfileCreatedDatesInRangeAsync(DateTime dateFrom, DateTime dateToExclusive);

        Task<List<AdminUserListProjection>> GetUserListAsync();
        Task<AdminUserDetailProjection?> GetUserDetailAsync(string userId);
        Task<List<AdminParentFeedbackProjection>> GetParentFeedbacksAsync(string? childName);

        Task<List<RegistrationAllowList>> GetAllowedRegistrationEmailsAsync();
        Task<RegistrationAllowList?> GetAllowedRegistrationEmailByIdAsync(int id);
        Task<bool> AllowedRegistrationEmailExistsAsync(string email);
        Task<RegistrationAllowList> AddAllowedRegistrationEmailAsync(RegistrationAllowList allowedEmail);
        Task DeleteAllowedRegistrationEmailAsync(RegistrationAllowList allowedEmail);

        Task<int> CountActiveScenariosAsync();
        Task<int> CountScenarioCompletionsAsync();
        Task<double> GetAverageScenarioConfidenceGainAsync();
        Task<decimal> GetAverageScenarioMoneyImpactAsync();
        Task<List<AdminScenarioSummaryProjection>> GetScenarioSummariesAsync();

        Task<List<AdminManageScenarioProjection>> GetManageScenariosAsync();
        Task<AdminManageScenarioProjection> CreateScenarioAsync(AdminUpsertScenarioRequestDto request);
        Task<AdminManageScenarioProjection?> UpdateScenarioAsync(int scenarioId, AdminUpsertScenarioRequestDto request);
        Task<bool> ActivateScenarioAsync(int scenarioId);
        Task<bool> DeactivateScenarioAsync(int scenarioId);
    }
}