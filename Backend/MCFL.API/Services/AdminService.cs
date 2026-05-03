using MCFL.API.DTOs.Admin.AccessControl;
using MCFL.API.DTOs.Admin.Feedbacks;
using MCFL.API.DTOs.Admin.Feelings;
using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Scenarios;
using MCFL.API.DTOs.Admin.Users;
using MCFL.API.DTOs.Feedbacks;
using MCFL.API.Models;
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

        public async Task<List<AdminUserListItemDto>> GetUsersAsync(string? search)
        {
            var rows = await _adminRepository.GetUserListAsync(search);

            return rows.Select(x => new AdminUserListItemDto
            {
                UserId = x.UserId,
                FullName = x.FullName,
                Email = x.Email,
                ParentGuardianName = x.ParentGuardianName,
                ParentGuardianEmail = x.ParentGuardianEmail,
                DobAge = $"{x.DateOfBirth:MMM dd, yyyy} ({CalculateAge(x.DateOfBirth)} years)",
                JoinDate = x.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
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
                JoinDate = data.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
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

        public async Task<List<AdminParentFeedbackDto>> GetParentFeedbacksAsync(string? childName)
        {
            var rows = await _adminRepository.GetParentFeedbacksAsync(childName);

            return rows.Select(x => new AdminParentFeedbackDto
            {
                ParentFeedbackId = x.ParentFeedbackId,
                ChildName = x.ChildName,
                ParentName = string.IsNullOrWhiteSpace(x.ParentName)
                    ? "Not provided"
                    : x.ParentName,
                ParentEmail = x.ParentEmail,
                MoneyStory = x.MoneyStory,
                WhatChildShouldLearn = x.WhatChildShouldLearn,
                SubmittedAt = x.SubmittedAt.ToString("yyyy-MM-ddTHH:mm:ssZ")
            }).ToList();
        }

        public async Task<List<AdminAllowedRegistrationEmailDto>> GetAllowedRegistrationEmailsAsync()
        {
            var allowedEmails = await _adminRepository.GetAllowedRegistrationEmailsAsync();

            return allowedEmails.Select(MapAllowedRegistrationEmail).ToList();
        }

        public async Task<AdminAllowedRegistrationEmailDto> AddAllowedRegistrationEmailAsync(
            AddAllowedRegistrationEmailRequest request)
        {
            var normalizedEmail = NormalizeEmail(request.Email);

            if (await _adminRepository.AllowedRegistrationEmailExistsAsync(normalizedEmail))
            {
                throw new InvalidOperationException("This email is already allowed for registration.");
            }

            var allowedEmail = new RegistrationAllowList
            {
                Email = normalizedEmail,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _adminRepository.AddAllowedRegistrationEmailAsync(allowedEmail);

            return MapAllowedRegistrationEmail(created);
        }

        public async Task<bool> DeleteAllowedRegistrationEmailAsync(int id)
        {
            var allowedEmail = await _adminRepository.GetAllowedRegistrationEmailByIdAsync(id);

            if (allowedEmail == null)
            {
                return false;
            }

            await _adminRepository.DeleteAllowedRegistrationEmailAsync(allowedEmail);

            return true;
        }

        public async Task<AdminScenariosDto> GetScenariosAsync(
            string? range = "allTime",
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            DateTime? dateFrom = null;
            DateTime? dateTo = null;

            var rangeKey = string.IsNullOrWhiteSpace(range) ? "allTime" : range;

            if (rangeKey != "allTime")
            {
                var today = DateTime.UtcNow.Date;

                DateTime resolvedFrom;
                DateTime resolvedTo;

                switch (rangeKey)
                {
                    case "today":
                        resolvedFrom = today;
                        resolvedTo = today;
                        break;

                    case "yesterday":
                        resolvedFrom = today.AddDays(-1);
                        resolvedTo = today.AddDays(-1);
                        break;

                    case "last7Days":
                        resolvedFrom = today.AddDays(-6);
                        resolvedTo = today;
                        break;

                    case "last30Days":
                        resolvedFrom = today.AddDays(-29);
                        resolvedTo = today;
                        break;

                    case "thisMonth":
                        resolvedFrom = new DateTime(today.Year, today.Month, 1);
                        resolvedTo = today;
                        break;

                    case "lastMonth":
                        var firstOfThisMonth = new DateTime(today.Year, today.Month, 1);
                        resolvedFrom = firstOfThisMonth.AddMonths(-1);
                        resolvedTo = firstOfThisMonth.AddDays(-1);
                        break;

                    case "thisYear":
                        resolvedFrom = new DateTime(today.Year, 1, 1);
                        resolvedTo = today;
                        break;

                    case "custom":
                        if (!startDate.HasValue || !endDate.HasValue)
                            throw new ArgumentException("Custom range requires startDate and endDate.");

                        var s = startDate.Value.Date;
                        var e = endDate.Value.Date;

                        if (e < s)
                            throw new ArgumentException("Custom range requires endDate to be greater than or equal to startDate.");

                        if (s > today || e > today)
                            throw new ArgumentException("Custom range cannot include future dates.");

                        resolvedFrom = s;
                        resolvedTo = e;
                        break;

                    default:
                        resolvedFrom = today.AddDays(-29);
                        resolvedTo = today;
                        break;
                }

                dateFrom = resolvedFrom;
                dateTo = resolvedTo.AddDays(1); // exclusive upper bound
            }

            var totalScenarios = await _adminRepository.CountActiveScenariosAsync();
            var totalCompletions = await _adminRepository.CountScenarioCompletionsAsync(dateFrom, dateTo);
            var avgConfidenceGain = await _adminRepository.GetAverageScenarioConfidenceGainAsync(dateFrom, dateTo);
            var avgMoneyImpact = await _adminRepository.GetAverageScenarioMoneyImpactAsync(dateFrom, dateTo);
            var summaries = await _adminRepository.GetScenarioSummariesAsync(dateFrom, dateTo);

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

        private static AdminAllowedRegistrationEmailDto MapAllowedRegistrationEmail(
            RegistrationAllowList allowedEmail)
        {
            return new AdminAllowedRegistrationEmailDto
            {
                Id = allowedEmail.RegistrationAllowListId,
                Email = allowedEmail.Email,
                CreatedAt = allowedEmail.CreatedAt.ToString("yyyy-MM-dd")
            };
        }

        private static AdminManageScenarioDto MapManageScenario(AdminManageScenarioProjection scenario)
        {
            return new AdminManageScenarioDto
            {
                ScenarioId = scenario.ScenarioId,
                Title = scenario.Title,
                Description = scenario.Description,
                IsActive = scenario.IsActive,
                CreatedAt = scenario.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                UpdatedAt = scenario.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
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

        private static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
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

        public async Task<List<AdminUserFeedbackDto>> GetUserFeedbackAsync(
    string? feedbackType,
    string? email,
    DateTime? startDate,
    DateTime? endDate)
        {
            var rows = await _adminRepository.GetUserFeedbackAsync(
                feedbackType,
                email,
                startDate,
                endDate);

            return rows.Select(x => new AdminUserFeedbackDto
            {
                UserFeedbackId = x.UserFeedbackId,
                UserId = x.UserId,
                FullName = x.FullName,
                Email = x.Email,
                FeedbackType = x.FeedbackType,
                Comment = x.Comment,
                SubmittedDate = x.SubmittedAt.ToString("yyyy-MM-ddTHH:mm:ssZ")
            }).ToList();
        }

        public async Task<List<string>> GetUserFeedbackTypesAsync()
        {
            return await _adminRepository.GetUserFeedbackTypesAsync();
        }

        public async Task<List<AdminMoneyFeelingDto>> GetMoneyFeelingsAsync(
            string? feeling, string? email, DateTime? startDate, DateTime? endDate)
        {
            var rows = await _adminRepository.GetMoneyFeelingsAsync(
                feeling, email, startDate, endDate);

            return rows.Select(x => new AdminMoneyFeelingDto
            {
                MoneyFeelingSubmissionId = x.MoneyFeelingSubmissionId,
                UserId = x.UserId,
                FullName = x.FullName,
                Email = x.Email,
                Feeling = x.Feeling,
                SubmittedDate = x.SubmittedAt.ToString("yyyy-MM-ddTHH:mm:ssZ")
            }).ToList();
        }
    }
}