using MCFL.API.Models;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentUserFeedbackSeeder : IDevelopmentSeeder
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DevelopmentUserFeedbackSeeder(
            AppDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            var feedbackTypes = await _context.UserFeedbackTypes
                .AsNoTracking()
                .ToDictionaryAsync(
                    x => x.Name,
                    x => x.UserFeedbackTypeId,
                    StringComparer.OrdinalIgnoreCase);

            if (!feedbackTypes.ContainsKey("General") ||
                !feedbackTypes.ContainsKey("Bug Report") ||
                !feedbackTypes.ContainsKey("Feature Idea") ||
                !feedbackTypes.ContainsKey("Scenario") ||
                !feedbackTypes.ContainsKey("Others"))
            {
                return;
            }

            var feedbackSeedData = new[]
            {
                new
                {
                    Email = "mahima@mcfl.local",
                    FeedbackTypeName = "Scenario",
                    Comment = "I want clearer labels on the money categories page.",
                    SubmittedAt = DateTime.UtcNow.AddDays(-1)
                },
                new
                {
                    Email = "mahima@mcfl.local",
                    FeedbackTypeName = "General",
                    Comment = "The scenarios are helpful and easy to understand.",
                    SubmittedAt = DateTime.UtcNow.AddDays(-4)
                },
                new
                {
                    Email = "susie@mcfl.local",
                    FeedbackTypeName = "Bug Report",
                    Comment = "I want clearer labels on the money categories page.",
                    SubmittedAt = DateTime.UtcNow.AddDays(-1)
                },
                new
                {
                    Email = "susie@mcfl.local",
                    FeedbackTypeName = "Feature Idea",
                    Comment = "I would like more scenario options about saving for school and handling unexpected expenses.",
                    SubmittedAt = DateTime.UtcNow.AddDays(-3)
                },
                new
                {
                    Email = "saman@mcfl.local",
                    FeedbackTypeName = "Bug Report",
                    Comment = "I want clearer labels on the money categories page.",
                    SubmittedAt = DateTime.UtcNow.AddDays(-1)
                },
                new
                {
                    Email = "saman@mcfl.local",
                    FeedbackTypeName = "Others",
                    Comment = "The dashboard is easy to understand and the progress indicators are helpful.",
                    SubmittedAt = DateTime.UtcNow.AddDays(-2)
                }
            };

            foreach (var item in feedbackSeedData)
            {
                var user = await _userManager.FindByEmailAsync(item.Email);

                if (user == null)
                {
                    continue;
                }

                var feedbackTypeId = feedbackTypes[item.FeedbackTypeName];

                var alreadyExists = await _context.UserFeedbacks.AnyAsync(x =>
                    x.UserId == user.Id &&
                    x.Comment == item.Comment &&
                    x.UserFeedbackTypeId == feedbackTypeId);

                if (alreadyExists)
                {
                    continue;
                }

                _context.UserFeedbacks.Add(new UserFeedback
                {
                    Comment = item.Comment,
                    SubmittedAt = item.SubmittedAt,
                    UserId = user.Id,
                    UserFeedbackTypeId = feedbackTypeId
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}