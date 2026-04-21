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
                MoneyHabitAnswer = "I usually save some of my money before spending.",
                MoneyLearningAnswer = "I learn best with examples and games.",
                WhatUserWantsToLearnAnswer = "How to balance saving and spending."
            },
            new
            {
                Email = "susie@mcfl.local",
                FullName = "Susie Larson",
                NickName = (string?)null,
                DateOfBirth = new DateOnly(2004, 8, 20),
                MoneyHabitAnswer = "I sometimes spend too quickly.",
                MoneyLearningAnswer = "I like short practical tips.",
                WhatUserWantsToLearnAnswer = "How to budget for monthly expenses."
            },
            new
            {
                Email = "saman@mcfl.local",
                FullName = "Saman Kayhanian",
                NickName = (string?)"Sam",
                DateOfBirth = new DateOnly(2010, 2, 8),
                MoneyHabitAnswer = "I keep money for things I really want.",
                MoneyLearningAnswer = "I like learning by trying choices.",
                WhatUserWantsToLearnAnswer = "How to make smart decisions with money."
            },
            new
            {
                Email = "harry@mcfl.local",
                FullName = "Harry",
                NickName = (string?)null,
                DateOfBirth = new DateOnly(2010, 2, 8),
                MoneyHabitAnswer = "I keep money for things I really want.",
                MoneyLearningAnswer = "I like learning by trying choices.",
                WhatUserWantsToLearnAnswer = "How to make smart decisions with money."
            },
            new
            {
                Email = "amrit@mcfl.local",
                FullName = "Amrit",
                NickName = (string?)null,
                DateOfBirth = new DateOnly(2003, 11, 3),
                MoneyHabitAnswer = "I plan purchases before buying.",
                MoneyLearningAnswer = "I prefer visual explanations.",
                WhatUserWantsToLearnAnswer = "How to set and reach savings goals."
            }
        };

            foreach (var item in profileData)
            {
                var user = await _userManager.FindByEmailAsync(item.Email);
                if (user == null) continue;

                var existingProfile = await _context.UserProfiles
                    .FirstOrDefaultAsync(x => x.UserId == user.Id);

                if (existingProfile == null)
                {
                    _context.UserProfiles.Add(new UserProfile
                    {
                        FullName = item.FullName,
                        NickName = item.NickName,
                        DateOfBirth = item.DateOfBirth,
                        MoneyHabitAnswer = item.MoneyHabitAnswer,
                        MoneyLearningAnswer = item.MoneyLearningAnswer,
                        WhatUserWantsToLearnAnswer = item.WhatUserWantsToLearnAnswer,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        UserId = user.Id
                    });
                }

                var existingStat = await _context.UserGameStats
                    .FirstOrDefaultAsync(x => x.UserId == user.Id);

                if (existingStat == null)
                {
                    _context.UserGameStats.Add(new UserGameStat
                    {
                        CurrentGameMoney = 120.00m,
                        CurrentConfidenceScore = 65,
                        UpdatedAt = DateTime.UtcNow,
                        UserId = user.Id
                    });
                }

                var hasGoals = await _context.SavingsGoals.AnyAsync(x => x.UserId == user.Id);
                if (!hasGoals)
                {
                    _context.SavingsGoals.AddRange(
                        new SavingsGoal
                        {
                            GoalTitle = "New Phone",
                            TargetAmount = 600.00m,
                            CurrentSavedAmount = 180.00m,
                            TargetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(6)),
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            UserId = user.Id
                        },
                        new SavingsGoal
                        {
                            GoalTitle = "Emergency Savings",
                            TargetAmount = 300.00m,
                            CurrentSavedAmount = 75.00m,
                            TargetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(4)),
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            UserId = user.Id
                        });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
