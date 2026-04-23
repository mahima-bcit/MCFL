using MCFL.API.Data;
using MCFL.API.Repositories.Projections;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AppDbContext _context;

        public AdminRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DateTime?> GetEarliestProfileCreatedAtAsync()
        {
            return await _context.UserProfiles
                .AsNoTracking()
                .OrderBy(x => x.CreatedAt)
                .Select(x => (DateTime?)x.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<List<string>> GetUserIdsCreatedInRangeAsync(DateTime dateFrom, DateTime dateToExclusive)
        {
            return await _context.UserProfiles
                .AsNoTracking()
                .Where(x => x.CreatedAt >= dateFrom && x.CreatedAt < dateToExclusive)
                .Select(x => x.UserId)
                .ToListAsync();
        }

        public async Task<int?> GetAverageConfidenceAsync(IReadOnlyCollection<string> userIds)
        {
            if (userIds.Count == 0)
            {
                return 0;
            }

            var average = await _context.UserGameStats
                .AsNoTracking()
                .Where(x => userIds.Contains(x.UserId))
                .Select(x => (double?)x.CurrentConfidenceScore)
                .AverageAsync();

            return average.HasValue ? (int)Math.Round(average.Value) : 0;
        }

        public async Task<decimal> GetAverageGoalProgressAsync(IReadOnlyCollection<string> userIds)
        {
            if (userIds.Count == 0)
            {
                return 0m;
            }

            var groupedTotals = await _context.LearningSavingsGoals
                .AsNoTracking()
                .Where(x => x.IsActive && userIds.Contains(x.UserId))
                .GroupBy(x => x.UserId)
                .Select(g => g.Sum(x => (double)(x.CurrentSavedAmount ?? 0m)))
                .ToListAsync();

            if (groupedTotals.Count == 0)
            {
                return 0m;
            }

            return Math.Round((decimal)groupedTotals.Average(), 2);
        }

        public async Task<int> CountScenarioPlaysInRangeAsync(DateTime dateFrom, DateTime dateToExclusive)
        {
            return await _context.ScenarioPlays
                .AsNoTracking()
                .CountAsync(x => x.PlayedAt >= dateFrom && x.PlayedAt < dateToExclusive);
        }

        public async Task<int> CountPositiveConfidenceScenarioPlaysInRangeAsync(DateTime dateFrom, DateTime dateToExclusive)
        {
            return await _context.ScenarioPlays
                .AsNoTracking()
                .CountAsync(x =>
                    x.PlayedAt >= dateFrom &&
                    x.PlayedAt < dateToExclusive &&
                    x.ConfidenceAfter > x.ConfidenceBefore);
        }

        public async Task<List<DateTime>> GetProfileCreatedDatesInRangeAsync(DateTime dateFrom, DateTime dateToExclusive)
        {
            return await _context.UserProfiles
                .AsNoTracking()
                .Where(x => x.CreatedAt >= dateFrom && x.CreatedAt < dateToExclusive)
                .Select(x => x.CreatedAt.Date)
                .ToListAsync();
        }

        public async Task<List<AdminUserListProjection>> GetUserListAsync()
        {
            return await (
                from user in _context.Users.AsNoTracking()
                join profile in _context.UserProfiles.AsNoTracking() on user.Id equals profile.UserId
                join stat in _context.UserGameStats.AsNoTracking() on user.Id equals stat.UserId into stats
                from stat in stats.DefaultIfEmpty()
                join parent in _context.ParentConsents.AsNoTracking() on user.Id equals parent.UserId into parents
                from parent in parents.DefaultIfEmpty()
                select new AdminUserListProjection
                {
                    UserId = user.Id,
                    FullName = profile.FullName,
                    Email = user.Email ?? "",
                    ParentGuardianName = parent != null ? parent.ParentName : "N/A",
                    ParentGuardianEmail = parent != null ? parent.ParentEmail : "N/A",
                    DateOfBirth = profile.DateOfBirth,
                    CreatedAt = profile.CreatedAt,
                    Confidence = stat != null ? stat.CurrentConfidenceScore : 0,
                    GameMoney = stat != null ? stat.CurrentGameMoney : 0m,
                    GoalProgress = (decimal)(
                        _context.LearningSavingsGoals
                            .Where(g => g.UserId == user.Id && g.IsActive)
                            .Select(g => (double?)(g.CurrentSavedAmount ?? 0m))
                            .Sum() ?? 0
                    ),
                    ScenariosCompleted = _context.ScenarioPlays.Count(sp => sp.UserId == user.Id)
                })
                .ToListAsync();
        }

        public async Task<AdminUserDetailProjection?> GetUserDetailAsync(string userId)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                return null;
            }

            var profile = await _context.UserProfiles
                .AsNoTracking()
                .Include(x => x.UserLearningPreferences)
                    .ThenInclude(x => x.LearningTopic)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (profile == null)
            {
                return null;
            }

            var stat = await _context.UserGameStats
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId);

            var parent = await _context.ParentConsents
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId);

            var activeGoal = await _context.LearningSavingsGoals
                .AsNoTracking()
                .Where(x => x.UserId == userId && x.IsActive)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            var scenariosCompleted = await _context.ScenarioPlays
                .AsNoTracking()
                .CountAsync(x => x.UserId == userId);

            return new AdminUserDetailProjection
            {
                UserId = user.Id,
                FullName = profile.FullName,
                Email = user.Email ?? "",
                ParentGuardianName = parent?.ParentName ?? "N/A",
                ParentGuardianEmail = parent?.ParentEmail ?? "N/A",
                DateOfBirth = profile.DateOfBirth,
                CreatedAt = profile.CreatedAt,
                Confidence = stat?.CurrentConfidenceScore ?? 0,
                GameMoney = stat?.CurrentGameMoney ?? 0m,
                GoalProgress = activeGoal?.CurrentSavedAmount ?? 0m,
                ScenariosCompleted = scenariosCompleted,

                HasBankAccount = profile.HasBankAccount,
                EarnsMoneyAnswer = profile.EarnsMoneyAnswer,
                HasSavingsAnswer = profile.HasSavingsAnswer,
                PaysBillsAnswer = profile.PaysBillsAnswer,
                SpendsOnWantsAnswer = profile.SpendsOnWantsAnswer,

                SelectedTopicNames = profile.UserLearningPreferences
                    .OrderBy(x => x.LearningTopic.SortOrder)
                    .Select(x => x.LearningTopic.TopicName)
                    .ToList(),

                LearningComments = profile.LearningComments,
                ParentTeachingsAnswer = profile.ParentTeachingsAnswer,

                LearningGoalTitle = activeGoal?.GoalTitle ?? "Save $300 per month",
                LearningGoalProgress = activeGoal?.CurrentSavedAmount ?? 0m,
                LearningGoalTargetAmount = activeGoal?.TargetAmount ?? 300m,
                LearningGoalTargetDate = activeGoal?.TargetDate
            };
        }
    }
}
