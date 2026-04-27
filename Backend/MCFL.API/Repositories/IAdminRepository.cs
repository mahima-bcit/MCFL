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
    }
}
