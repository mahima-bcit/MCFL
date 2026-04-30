using MCFL.API.Models;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentProfileSeeder : IDevelopmentSeeder
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DevelopmentProfileSeeder(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            var profileData = new[]
            {
                new
                {
                    Email = "mahima@mcfl.local",
                    FullName = "Mahima Sharma",
                    NickName = (string?)"Masha",
                    DateOfBirth = new DateOnly(2009, 5, 12),
                    HasBankAccount = true,
                    EarnsMoneyAnswer = "yes",
                    HasSavingsAnswer = "yes",
                    PaysBillsAnswer = "no",
                    SpendsOnWantsAnswer = "sometimes",
                    LearningComments = "I want to learn how to manage money better and save regularly.",
                    LearningTopics = new[] { "How to save money", "How to budget" },
                    ParentTeachingsAnswer = (string?)"Save first before spending.",
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-24),
                    CurrentGameMoney = 150.00m,
                    CurrentConfidenceScore = 72,
                    LearningGoalTitle = "Save $300 for your future iPad",
                    LearningGoalTargetAmount = 300.00m
                },
                new
                {
                    Email = "susie@mcfl.local",
                    FullName = "Susie Larson",
                    NickName = (string?)null,
                    DateOfBirth = new DateOnly(2004, 8, 20),
                    HasBankAccount = true,
                    EarnsMoneyAnswer = "yes",
                    HasSavingsAnswer = "yes",
                    PaysBillsAnswer = "sometimes",
                    SpendsOnWantsAnswer = "sometimes",
                    LearningComments = "I want to understand investing and how to plan my monthly spending better.",
                    LearningTopics = new[] { "How to invest", "How to budget" },
                    ParentTeachingsAnswer = (string?)null,
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-17),
                    CurrentGameMoney = 140.00m,
                    CurrentConfidenceScore = 68,
                    LearningGoalTitle = "Save $300 for your future iPad",
                    LearningGoalTargetAmount = 300.00m
                },
                new
                {
                    Email = "saman@mcfl.local",
                    FullName = "Saman Kayhanian",
                    NickName = (string?)"Sam",
                    DateOfBirth = new DateOnly(2010, 2, 8),
                    HasBankAccount = false,
                    EarnsMoneyAnswer = "no",
                    HasSavingsAnswer = "no",
                    PaysBillsAnswer = "no",
                    SpendsOnWantsAnswer = "yes",
                    LearningComments = "I want to start learning the basics of saving and making smarter money choices.",
                    LearningTopics = new[] { "How to save money", "How to take care of my money" },
                    ParentTeachingsAnswer = (string?)null,
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-11),
                    CurrentGameMoney = 100.00m,
                    CurrentConfidenceScore = 60,
                    LearningGoalTitle = "Save $300 for your future iPad",
                    LearningGoalTargetAmount = 300.00m
                },
                new
                {
                    Email = "harry@mcfl.local",
                    FullName = "Harry",
                    NickName = (string?)null,
                    DateOfBirth = new DateOnly(2010, 2, 8),
                    HasBankAccount = false,
                    EarnsMoneyAnswer = "sometimes",
                    HasSavingsAnswer = "no",
                    PaysBillsAnswer = "no",
                    SpendsOnWantsAnswer = "yes",
                    LearningComments = "I want to learn everything from saving money to budgeting and investing.",
                    LearningTopics = new[] { "How to save money", "How to budget", "How to invest" },
                    ParentTeachingsAnswer = (string?)null,
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-6),
                    CurrentGameMoney = 95.00m,
                    CurrentConfidenceScore = 58,
                    LearningGoalTitle = "Save $300 for your future iPad",
                    LearningGoalTargetAmount = 300.00m
                },
                new
                {
                    Email = "amrit@mcfl.local",
                    FullName = "Amrit",
                    NickName = (string?)null,
                    DateOfBirth = new DateOnly(2003, 11, 3),
                    HasBankAccount = true,
                    EarnsMoneyAnswer = "yes",
                    HasSavingsAnswer = "yes",
                    PaysBillsAnswer = "yes",
                    SpendsOnWantsAnswer = "sometimes",
                    LearningComments = "I want to improve my long-term money planning and investing habits.",
                    LearningTopics = new[] { "How to invest", "How to take care of my money" },
                    ParentTeachingsAnswer = (string?)null,
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-2),
                    CurrentGameMoney = 165.00m,
                    CurrentConfidenceScore = 67,
                    LearningGoalTitle = "Save $300 for your future iPad",
                    LearningGoalTargetAmount = 300.00m
                }
            };

            var topicsByName = await _context.LearningTopics.ToDictionaryAsync(x => x.TopicName, x => x.LearningTopicId);

            foreach (var item in profileData)
            {
                var user = await _userManager.FindByEmailAsync(item.Email);
                if (user == null) continue;

                var existingProfile = await _context.UserProfiles
                    .FirstOrDefaultAsync(x => x.UserId == user.Id);

                if (existingProfile == null)
                {
                    existingProfile = new UserProfile
                    {
                        FullName = item.FullName,
                        NickName = item.NickName,
                        DateOfBirth = item.DateOfBirth,
                        HasBankAccount = item.HasBankAccount,
                        EarnsMoneyAnswer = item.EarnsMoneyAnswer,
                        HasSavingsAnswer = item.HasSavingsAnswer,
                        PaysBillsAnswer = item.PaysBillsAnswer,
                        SpendsOnWantsAnswer = item.SpendsOnWantsAnswer,
                        LearningComments = item.LearningComments,
                        ParentTeachingsAnswer = item.ParentTeachingsAnswer,
                        CreatedAt = item.CreatedAt,
                        UpdatedAt = item.CreatedAt,
                        UserId = user.Id
                    };

                    _context.UserProfiles.Add(existingProfile);
                    await _context.SaveChangesAsync();
                }

                var existingPreferenceTopicIds = await _context.UserLearningPreferences
                    .Where(x => x.UserProfileId == existingProfile.UserProfileId)
                    .Select(x => x.LearningTopicId)
                    .ToListAsync();

                var newPreferences = item.LearningTopics
                    .Where(topicName => topicsByName.ContainsKey(topicName))
                    .Select(topicName => topicsByName[topicName])
                    .Where(topicId => !existingPreferenceTopicIds.Contains(topicId))
                    .Select(topicId => new UserLearningPreference
                    {
                        UserProfileId = existingProfile.UserProfileId,
                        LearningTopicId = topicId,
                        CreatedAt = item.CreatedAt
                    })
                    .ToList();

                if (newPreferences.Count > 0)
                {
                    _context.UserLearningPreferences.AddRange(newPreferences);
                }

                var existingStat = await _context.UserGameStats
                    .FirstOrDefaultAsync(x => x.UserId == user.Id);

                if (existingStat == null)
                {
                    _context.UserGameStats.Add(new UserGameStat
                    {
                        CurrentGameMoney = item.CurrentGameMoney,
                        CurrentConfidenceScore = item.CurrentConfidenceScore,
                        UpdatedAt = item.CreatedAt.AddHours(2),
                        UserId = user.Id
                    });
                }

                var hasGoal = await _context.LearningSavingsGoals.AnyAsync(x => x.UserId == user.Id && x.IsActive);

                if (!hasGoal)
                {
                    _context.LearningSavingsGoals.Add(new LearningSavingsGoal
                    {
                        GoalTitle = item.LearningGoalTitle,
                        TargetAmount = item.LearningGoalTargetAmount,
                        CurrentSavedAmount = 0.00m,
                        IsActive = true,
                        CreatedAt = item.CreatedAt.AddDays(1),
                        UpdatedAt = item.CreatedAt.AddDays(1),
                        TargetDate = GetEndOfMonth(item.CreatedAt),
                        UserId = user.Id
                    });
                }
            }

            await _context.SaveChangesAsync();
        }

        private static DateOnly GetEndOfMonth(DateTime date)
        {
            var lastDay = DateTime.DaysInMonth(date.Year, date.Month);
            return new DateOnly(date.Year, date.Month, lastDay);
        }
    }
}
