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
            var goalRows = await _context.LearningSavingsGoals
                .AsNoTracking()
                .Where(x => x.IsActive)
                .Select(x => new
                {
                    x.UserId,
                    Amount = x.CurrentSavedAmount ?? 0m
                })
                .ToListAsync();

            var goalProgressLookup = goalRows
                .GroupBy(x => x.UserId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Sum(x => x.Amount)
                );

            var scenarioCountsByUser =
                from scenarioPlay in _context.ScenarioPlays.AsNoTracking()
                group scenarioPlay by scenarioPlay.UserId into g
                select new
                {
                    UserId = g.Key,
                    ScenariosCompleted = g.Count()
                };

            var users = await (
                from user in _context.Users.AsNoTracking()
                join profile in _context.UserProfiles.AsNoTracking()
                    on user.Id equals profile.UserId
                join stat in _context.UserGameStats.AsNoTracking()
                    on user.Id equals stat.UserId into stats
                from stat in stats.DefaultIfEmpty()
                join parent in _context.ParentConsents.AsNoTracking()
                    on user.Id equals parent.UserId into parents
                from parent in parents.DefaultIfEmpty()
                join scenario in scenarioCountsByUser
                    on user.Id equals scenario.UserId into scenarios
                from scenario in scenarios.DefaultIfEmpty()
                select new
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
                    ScenariosCompleted = scenario != null ? scenario.ScenariosCompleted : 0
                })
                .ToListAsync();

            return users.Select(user => new AdminUserListProjection
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                ParentGuardianName = user.ParentGuardianName,
                ParentGuardianEmail = user.ParentGuardianEmail,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt,
                Confidence = user.Confidence,
                GameMoney = user.GameMoney,
                GoalProgress = goalProgressLookup.TryGetValue(user.UserId, out var goalProgress)
                    ? goalProgress
                    : 0m,
                ScenariosCompleted = user.ScenariosCompleted
            }).ToList();
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

        public async Task<int> CountActiveScenariosAsync()
        {
            return await _context.Scenarios
                .AsNoTracking()
                .CountAsync(x => x.IsActive);
        }

        public async Task<int> CountScenarioCompletionsAsync()
        {
            return await _context.ScenarioPlays
                .AsNoTracking()
                .CountAsync();
        }

        public async Task<double> GetAverageScenarioConfidenceGainAsync()
        {
            var average = await _context.ScenarioPlays
                .AsNoTracking()
                .Select(x => (double?)x.ConfidenceImpactSnapshot)
                .AverageAsync();

            return average.HasValue ? Math.Round(average.Value, 1) : 0;
        }

        public async Task<decimal> GetAverageScenarioMoneyImpactAsync()
        {
            var average = await _context.ScenarioPlays
                .AsNoTracking()
                .Select(x => (double?)x.MoneyImpactSnapshot)
                .AverageAsync();

            return average.HasValue ? Math.Round((decimal)average.Value, 2) : 0m;
        }

        public async Task<List<AdminScenarioSummaryProjection>> GetScenarioSummariesAsync()
        {
            var scenarios = await _context.Scenarios
                .AsNoTracking()
                .Where(x => x.IsActive)
                .Select(x => new
                {
                    x.ScenarioId,
                    x.Title
                })
                .ToListAsync();

            if (scenarios.Count == 0)
            {
                return new List<AdminScenarioSummaryProjection>();
            }

            var scenarioIds = scenarios.Select(x => x.ScenarioId).ToList();

            var plays = await _context.ScenarioPlays
                .AsNoTracking()
                .Where(x => scenarioIds.Contains(x.ScenarioId))
                .Select(x => new
                {
                    x.ScenarioId,
                    x.ScenarioChoiceId,
                    x.ConfidenceImpactSnapshot,
                    x.MoneyImpactSnapshot
                })
                .ToListAsync();

            var choices = await _context.ScenarioChoices
                .AsNoTracking()
                .Where(x => scenarioIds.Contains(x.ScenarioId))
                .Select(x => new
                {
                    x.ScenarioChoiceId,
                    x.ScenarioId,
                    x.OptionText
                })
                .ToListAsync();

            var totalCompletions = plays.Count;

            var result = scenarios
                .Select(scenario =>
                {
                    var scenarioPlays = plays
                        .Where(x => x.ScenarioId == scenario.ScenarioId)
                        .ToList();

                    var completions = scenarioPlays.Count;

                    var avgConfidenceGain = completions > 0
                        ? Math.Round(scenarioPlays.Average(x => (double)x.ConfidenceImpactSnapshot), 1)
                        : 0;

                    var avgMoneyImpact = completions > 0
                        ? Math.Round((decimal)scenarioPlays.Average(x => (double)x.MoneyImpactSnapshot), 2)
                        : 0m;

                    var mostPopularChoice = "No plays yet";

                    if (completions > 0)
                    {
                        var mostPopularChoiceId = scenarioPlays
                            .GroupBy(x => x.ScenarioChoiceId)
                            .OrderByDescending(g => g.Count())
                            .ThenBy(g => g.Key)
                            .Select(g => g.Key)
                            .First();

                        mostPopularChoice = choices
                            .FirstOrDefault(x => x.ScenarioChoiceId == mostPopularChoiceId)
                            ?.OptionText ?? "No plays yet";
                    }

                    var percentageOfTotal = totalCompletions > 0
                        ? Math.Round((double)completions / totalCompletions * 100, 1)
                        : 0;

                    return new AdminScenarioSummaryProjection
                    {
                        ScenarioId = scenario.ScenarioId,
                        Title = scenario.Title,
                        MostPopularChoice = mostPopularChoice,
                        Completions = completions,
                        AvgConfidenceGain = avgConfidenceGain,
                        AvgMoneyImpact = avgMoneyImpact,
                        PercentageOfTotal = percentageOfTotal
                    };
                })
                .OrderByDescending(x => x.Completions)
                .ThenBy(x => x.Title)
                .ToList();

            return result;
        }
    }
}
