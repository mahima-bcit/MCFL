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
                    GoalTitle = "Save for a new phone",
                    GoalTarget = 300.00m,
                    GoalSaved = 150.00m,
                    GoalTargetDate = (DateOnly?)new DateOnly(2026, 8, 1),
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
                    Beliefs = new Dictionary<string, string>
                    {
                        { "moneyIsGood",             "agree"    },
                        { "moneyIsBad",              "disagree" },
                        { "likeHavingMoney",         "agree"    },
                        { "likeDoingThingsForFree",  "agree"    },
                        { "loveSpendingMoney",       "disagree" },
                        { "parentsGiveMeMoney",      "agree"    },
                        { "dontNeedMoney",           "disagree" },
                        { "likeHelpingOthers",       "agree"    },
                    },
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-24),
                    CurrentGameMoney = 150.00m,
                    CurrentConfidenceScore = 72
                },
                new
                {
                    Email = "susie@mcfl.local",
                    GoalTitle = "Save for a concert ticket",
                    GoalTarget = 120.00m,
                    GoalSaved = 80.00m,
                    GoalTargetDate = (DateOnly?)new DateOnly(2026, 7, 15),
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
                    Beliefs = new Dictionary<string, string>
                    {
                        { "moneyIsGood",             "agree"    },
                        { "moneyIsBad",              "disagree" },
                        { "likeHavingMoney",         "agree"    },
                        { "likeDoingThingsForFree",  "unsure"   },
                        { "loveSpendingMoney",       "unsure"   },
                        { "parentsGiveMeMoney",      "disagree" },
                        { "dontNeedMoney",           "disagree" },
                        { "likeHelpingOthers",       "agree"    },
                    },
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-17),
                    CurrentGameMoney = 140.00m,
                    CurrentConfidenceScore = 68
                },
                new
                {
                    Email = "saman@mcfl.local",
                    GoalTitle = "Save for new shoes",
                    GoalTarget = 80.00m,
                    GoalSaved = 20.00m,
                    GoalTargetDate = (DateOnly?)null,
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
                    Beliefs = new Dictionary<string, string>
                    {
                        { "moneyIsGood",             "unsure"   },
                        { "moneyIsBad",              "unsure"   },
                        { "likeHavingMoney",         "agree"    },
                        { "likeDoingThingsForFree",  "agree"    },
                        { "loveSpendingMoney",       "agree"    },
                        { "parentsGiveMeMoney",      "agree"    },
                        { "dontNeedMoney",           "disagree" },
                        { "likeHelpingOthers",       "agree"    },
                    },
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-11),
                    CurrentGameMoney = 100.00m,
                    CurrentConfidenceScore = 60
                },
                new
                {
                    Email = "harry@mcfl.local",
                    GoalTitle = "Save for a gaming headset",
                    GoalTarget = 200.00m,
                    GoalSaved = 50.00m,
                    GoalTargetDate = (DateOnly?)new DateOnly(2026, 9, 1),
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
                    Beliefs = new Dictionary<string, string>
                    {
                        { "moneyIsGood",             "agree"    },
                        { "moneyIsBad",              "disagree" },
                        { "likeHavingMoney",         "agree"    },
                        { "likeDoingThingsForFree",  "disagree" },
                        { "loveSpendingMoney",       "agree"    },
                        { "parentsGiveMeMoney",      "agree"    },
                        { "dontNeedMoney",           "disagree" },
                        { "likeHelpingOthers",       "unsure"   },
                    },
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-6),
                    CurrentGameMoney = 95.00m,
                    CurrentConfidenceScore = 58
                },
                new
                {
                    Email = "amrit@mcfl.local",
                    GoalTitle = "Save for a laptop",
                    GoalTarget = 1200.00m,
                    GoalSaved = 400.00m,
                    GoalTargetDate = (DateOnly?)new DateOnly(2026, 12, 1),
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
                    Beliefs = new Dictionary<string, string>
                    {
                        { "moneyIsGood",             "agree"    },
                        { "moneyIsBad",              "disagree" },
                        { "likeHavingMoney",         "agree"    },
                        { "likeDoingThingsForFree",  "disagree" },
                        { "loveSpendingMoney",       "unsure"   },
                        { "parentsGiveMeMoney",      "disagree" },
                        { "dontNeedMoney",           "disagree" },
                        { "likeHelpingOthers",       "agree"    },
                    },
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-2),
                    CurrentGameMoney = 165.00m,
                    CurrentConfidenceScore = 67
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
                        LearningComments = item.LearningComments,
                        ParentTeachingsAnswer = item.ParentTeachingsAnswer,
                        CreatedAt = item.CreatedAt,
                        UpdatedAt = item.CreatedAt,
                        UserId = user.Id
                    };

                    _context.UserProfiles.Add(existingProfile);
                    await _context.SaveChangesAsync();
                }

                var hasFinancialProfile = await _context.UserFinancialProfiles
                    .AnyAsync(x => x.UserProfileId == existingProfile.UserProfileId);

                if (!hasFinancialProfile)
                {
                    _context.UserFinancialProfiles.Add(new UserFinancialProfile
                    {
                        UserProfileId = existingProfile.UserProfileId,
                        HasBankAccount = item.HasBankAccount,
                        EarnsMoneyAnswer = item.EarnsMoneyAnswer,
                        HasSavingsAnswer = item.HasSavingsAnswer,
                        PaysBillsAnswer = item.PaysBillsAnswer,
                        SpendsOnWantsAnswer = item.SpendsOnWantsAnswer,
                        CreatedAt = item.CreatedAt
                    });
                }

                var existingBeliefKeys = await _context.UserBeliefs
                    .Where(x => x.UserProfileId == existingProfile.UserProfileId)
                    .Select(x => x.BeliefKey)
                    .ToListAsync();

                foreach (var (key, answer) in item.Beliefs)
                {
                    if (!existingBeliefKeys.Contains(key))
                    {
                        _context.UserBeliefs.Add(new UserBelief
                        {
                            UserProfileId = existingProfile.UserProfileId,
                            BeliefKey = key,
                            Answer = answer,
                            CreatedAt = item.CreatedAt
                        });
                    }
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

                var hasGoal = await _context.LearningSavingsGoals
                    .AnyAsync(g => g.UserId == user.Id && g.IsActive);

                if (!hasGoal)
                {
                    _context.LearningSavingsGoals.Add(new LearningSavingsGoal
                    {
                        GoalTitle = item.GoalTitle,
                        TargetAmount = item.GoalTarget,
                        CurrentSavedAmount = item.GoalSaved,
                        TargetDate = item.GoalTargetDate,
                        IsActive = true,
                        CreatedAt = item.CreatedAt.AddHours(1),
                        UpdatedAt = item.CreatedAt.AddHours(1),
                        UserId = user.Id
                    });
                }
            }

            await _context.SaveChangesAsync();
        }


    }
}
