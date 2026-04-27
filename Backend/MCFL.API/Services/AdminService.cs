using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Scenarios;
using MCFL.API.DTOs.Admin.Users;
using MCFL.API.Repositories;
using MCFL.API.Repositories.Projections;

namespace MCFL.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<AdminOverviewDto> GetOverviewAsync(string? range, DateTime? startDate, DateTime? endDate)
        {
            var today = DateTime.UtcNow.Date;

            DateTime dateFrom;
            DateTime dateTo;
            var rangeKey = string.IsNullOrWhiteSpace(range) ? "last30Days" : range;

            switch (rangeKey)
            {
                case "today":
                    dateFrom = today;
                    dateTo = today;
                    break;

                case "yesterday":
                    dateFrom = today.AddDays(-1);
                    dateTo = today.AddDays(-1);
                    break;

                case "last7Days":
                    dateFrom = today.AddDays(-6);
                    dateTo = today;
                    break;

                case "last30Days":
                    dateFrom = today.AddDays(-29);
                    dateTo = today;
                    break;

                case "thisMonth":
                    dateFrom = new DateTime(today.Year, today.Month, 1);
                    dateTo = today;
                    break;

                case "lastMonth":
                    var firstDayOfThisMonth = new DateTime(today.Year, today.Month, 1);
                    var firstDayOfLastMonth = firstDayOfThisMonth.AddMonths(-1);
                    var lastDayOfLastMonth = firstDayOfThisMonth.AddDays(-1);
                    dateFrom = firstDayOfLastMonth.Date;
                    dateTo = lastDayOfLastMonth.Date;
                    break;

                case "thisYear":
                    dateFrom = new DateTime(today.Year, 1, 1);
                    dateTo = today;
                    break;

                case "allTime":
                    var earliestProfileDate = await _adminRepository.GetEarliestProfileCreatedAtAsync();
                    dateFrom = earliestProfileDate?.Date ?? today;
                    dateTo = today;
                    break;

                case "custom":
                    if (!startDate.HasValue || !endDate.HasValue)
                    {
                        throw new ArgumentException("Custom range requires startDate and endDate.");
                    }

                    var start = startDate.Value.Date;
                    var end = endDate.Value.Date;

                    if (end < start)
                    {
                        throw new ArgumentException("Custom range requires endDate to be greater than or equal to startDate.");
                    }

                    if (start > today || end > today)
                    {
                        throw new ArgumentException("Custom range cannot include future dates.");
                    }

                    dateFrom = start;
                    dateTo = end;
                    break;

                default:
                    dateFrom = today.AddDays(-29);
                    dateTo = today;
                    rangeKey = "last30Days";
                    break;
            }

            var rangeEndExclusive = dateTo.AddDays(1);

            var userIdsInRange = await _adminRepository.GetUserIdsCreatedInRangeAsync(dateFrom, rangeEndExclusive);
            var totalUsers = userIdsInRange.Count;

            var avgConfidence = totalUsers > 0
                ? await _adminRepository.GetAverageConfidenceAsync(userIdsInRange) ?? 0
                : 0;

            var avgSavings = totalUsers > 0
                ? await _adminRepository.GetAverageGoalProgressAsync(userIdsInRange)
                : 0m;

            var scenariosCompleted = await _adminRepository.CountScenarioPlaysInRangeAsync(dateFrom, rangeEndExclusive);
            var positiveConfidenceCount = await _adminRepository.CountPositiveConfidenceScenarioPlaysInRangeAsync(dateFrom, rangeEndExclusive);

            var decisionQuality = scenariosCompleted > 0
                ? (int)Math.Round((double)positiveConfidenceCount / scenariosCompleted * 100)
                : 0;

            var createdDates = await _adminRepository.GetProfileCreatedDatesInRangeAsync(dateFrom, rangeEndExclusive);
            var createdDateCounts = createdDates.GroupBy(d => d).ToDictionary(group => group.Key, group => group.Count());
            var totalDays = (dateTo - dateFrom).Days + 1;

            var userGrowthSeries = Enumerable.Range(0, totalDays)
                .Select(offset =>
                {
                    var day = dateFrom.AddDays(offset);
                    createdDateCounts.TryGetValue(day, out var count);
                    return new UserGrowthPointDto
                    {
                        Label = day.ToString("MMM d"),
                        Value = count
                    };
                })
                .ToList();

            return new AdminOverviewDto
            {
                RangeKey = rangeKey,
                DateFrom = dateFrom.ToString("yyyy-MM-dd"),
                DateTo = dateTo.ToString("yyyy-MM-dd"),
                TotalUsers = totalUsers,
                AvgConfidence = avgConfidence,
                AvgSavings = avgSavings,
                ScenariosCompleted = scenariosCompleted,
                DecisionQuality = decisionQuality,
                UserGrowthSeries = userGrowthSeries
            };
        }

        public async Task<List<AdminUserListItemDto>> GetUsersAsync()
        {
            var rows = await _adminRepository.GetUserListAsync();

            return rows.Select(x => new AdminUserListItemDto
            {
                UserId = x.UserId,
                FullName = x.FullName,
                Email = x.Email,
                ParentGuardianName = x.ParentGuardianName,
                ParentGuardianEmail = x.ParentGuardianEmail,
                DobAge = $"{x.DateOfBirth:MMM dd, yyyy} ({CalculateAge(x.DateOfBirth)} years)",
                JoinDate = x.CreatedAt.ToString("yyyy-MM-dd"),
                Confidence = x.Confidence,
                GameMoney = x.GameMoney,
                GoalProgress = x.GoalProgress,
                ScenariosCompleted = x.ScenariosCompleted
            }).ToList();
        }

        public async Task<AdminUserDetailDto?> GetUserByIdAsync(string userId)
        {
            var data = await _adminRepository.GetUserDetailAsync(userId);
            if (data == null)
            {
                return null;
            }

            return new AdminUserDetailDto
            {
                UserId = data.UserId,
                FullName = data.FullName,
                Email = data.Email,
                ParentGuardianName = data.ParentGuardianName,
                ParentGuardianEmail = data.ParentGuardianEmail,
                DobAge = $"{data.DateOfBirth:MMM dd, yyyy} ({CalculateAge(data.DateOfBirth)} years)",
                JoinDate = data.CreatedAt.ToString("yyyy-MM-dd"),
                Confidence = data.Confidence,
                GameMoney = data.GameMoney,
                GoalProgress = data.GoalProgress,
                ScenariosCompleted = data.ScenariosCompleted,

                FinancialStuff = new Dictionary<string, string>
                {
                    { "Has Bank Account", data.HasBankAccount ? "Yes" : "No" },
                    { "Earns Money", data.EarnsMoneyAnswer },
                    { "Has Savings", data.HasSavingsAnswer },
                    { "Pays Bills", data.PaysBillsAnswer },
                    { "Spends On Wants", data.SpendsOnWantsAnswer }
                },

                LearningPreferences = new Dictionary<string, string>
                {
                    {
                        "Selected Topics",
                        data.SelectedTopicNames.Any()
                            ? string.Join(", ", data.SelectedTopicNames)
                            : "Not provided"
                    },
                    {
                        "Learning Comments",
                        string.IsNullOrWhiteSpace(data.LearningComments)
                            ? "Not provided"
                            : data.LearningComments
                    }
                },

                ParentTeachings = string.IsNullOrWhiteSpace(data.ParentTeachingsAnswer)
                    ? "Not provided"
                    : data.ParentTeachingsAnswer,

                LearningGoalTitle = data.LearningGoalTitle,
                LearningGoalProgress = data.LearningGoalProgress,
                LearningGoalTargetAmount = data.LearningGoalTargetAmount,
                LearningGoalTargetDate = data.LearningGoalTargetDate?.ToString("yyyy-MM-dd") ?? ""
            };
        }

        private static int CalculateAge(DateOnly dateOfBirth)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var age = today.Year - dateOfBirth.Year;

            if (dateOfBirth > today.AddYears(-age))
            {
                age--;
            }

            return age;
        }

        public async Task<AdminScenariosDto> GetScenariosAsync()
        {
            var totalScenarios = await _adminRepository.CountActiveScenariosAsync();
            var totalCompletions = await _adminRepository.CountScenarioCompletionsAsync();
            var avgConfidenceGain = await _adminRepository.GetAverageScenarioConfidenceGainAsync();
            var avgMoneyImpact = await _adminRepository.GetAverageScenarioMoneyImpactAsync();
            var summaries = await _adminRepository.GetScenarioSummariesAsync();

            return new AdminScenariosDto
            {
                TotalScenarios = totalScenarios,
                TotalCompletions = totalCompletions,
                AvgConfidenceGain = avgConfidenceGain,
                AvgMoneyImpact = avgMoneyImpact,
                Scenarios = summaries.Select(x => new AdminScenarioSummaryDto
                {
                    ScenarioId = x.ScenarioId,
                    Title = x.Title,
                    MostPopularChoice = x.MostPopularChoice,
                    Completions = x.Completions,
                    AvgConfidenceGain = x.AvgConfidenceGain,
                    AvgMoneyImpact = x.AvgMoneyImpact,
                    PercentageOfTotal = x.PercentageOfTotal
                }).ToList()
            };
        }

        public async Task<List<AdminManageScenarioDto>> GetManageScenariosAsync()
        {
            var scenarios = await _adminRepository.GetManageScenariosAsync();
            return scenarios.Select(MapManageScenario).ToList();
        }

        public async Task<AdminManageScenarioDto> CreateScenarioAsync(AdminUpsertScenarioRequestDto request)
        {
            var normalized = NormalizeScenarioRequest(request);
            ValidateScenarioRequest(normalized);

            var created = await _adminRepository.CreateScenarioAsync(normalized);
            return MapManageScenario(created);
        }

        public async Task<AdminManageScenarioDto?> UpdateScenarioAsync(
            int scenarioId,
            AdminUpsertScenarioRequestDto request)
        {
            var normalized = NormalizeScenarioRequest(request);
            ValidateScenarioRequest(normalized);

            var updated = await _adminRepository.UpdateScenarioAsync(scenarioId, normalized);
            return updated == null ? null : MapManageScenario(updated);
        }

        public async Task<bool> ActivateScenarioAsync(int scenarioId)
        {
            return await _adminRepository.ActivateScenarioAsync(scenarioId);
        }

        public async Task<bool> DeactivateScenarioAsync(int scenarioId)
        {
            return await _adminRepository.DeactivateScenarioAsync(scenarioId);
        }

        private static AdminManageScenarioDto MapManageScenario(AdminManageScenarioProjection scenario)
        {
            return new AdminManageScenarioDto
            {
                ScenarioId = scenario.ScenarioId,
                Title = scenario.Title,
                Description = scenario.Description,
                IsActive = scenario.IsActive,
                UpdatedAt = scenario.UpdatedAt.ToString("yyyy-MM-dd"),
                Choices = scenario.Choices
                    .OrderBy(x => x.SortOrder)
                    .Select(x => new AdminManageScenarioChoiceDto
                    {
                        ScenarioChoiceId = x.ScenarioChoiceId,
                        OptionText = x.OptionText,
                        ResultText = x.ResultText,
                        LessonText = x.LessonText,
                        MoneyImpact = x.MoneyImpact,
                        ConfidenceImpact = x.ConfidenceImpact,
                        SortOrder = x.SortOrder,
                        IsActive = x.IsActive
                    })
                    .ToList()
            };
        }

        private static AdminUpsertScenarioRequestDto NormalizeScenarioRequest(AdminUpsertScenarioRequestDto request)
        {
            return new AdminUpsertScenarioRequestDto
            {
                Title = request.Title?.Trim() ?? "",
                Description = request.Description?.Trim() ?? "",
                Choices = request.Choices.Select(choice => new AdminUpsertScenarioChoiceRequestDto
                {
                    ScenarioChoiceId = choice.ScenarioChoiceId,
                    OptionText = choice.OptionText?.Trim() ?? "",
                    ResultText = choice.ResultText?.Trim() ?? "",
                    LessonText = string.IsNullOrWhiteSpace(choice.LessonText) ? null : choice.LessonText.Trim(),
                    MoneyImpact = choice.MoneyImpact,
                    ConfidenceImpact = choice.ConfidenceImpact
                }).ToList()
            };
        }

        private static void ValidateScenarioRequest(AdminUpsertScenarioRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Title))
            {
                throw new ArgumentException("Scenario title is required.");
            }

            if (string.IsNullOrWhiteSpace(request.Description))
            {
                throw new ArgumentException("Scenario description is required.");
            }

            if (request.Choices == null || request.Choices.Count != 3)
            {
                throw new ArgumentException("A scenario must have exactly 3 choices.");
            }

            for (var i = 0; i < request.Choices.Count; i++)
            {
                var choice = request.Choices[i];
                var choiceNumber = i + 1;

                if (string.IsNullOrWhiteSpace(choice.OptionText))
                {
                    throw new ArgumentException($"Choice {choiceNumber} option text is required.");
                }

                if (string.IsNullOrWhiteSpace(choice.ResultText))
                {
                    throw new ArgumentException($"Choice {choiceNumber} result text is required.");
                }
            }
        }
    }
}
