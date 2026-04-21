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

        public DevelopmentUserFeedbackSeeder(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            var emails = new[] { "mahima@mcfl.local", "susie@mcfl.local", "saman@mcfl.local" };

            foreach (var email in emails)
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null) continue;

                var hasFeedback = await _context.UserFeedbacks.AnyAsync(x => x.UserId == user.Id);
                if (hasFeedback) continue;

                _context.UserFeedbacks.AddRange(
                    new UserFeedback
                    {
                        FeedbackType = "Suggestion",
                        Comment = "The scenarios are helpful and easy to understand.",
                        SubmittedAt = DateTime.UtcNow.AddDays(-4),
                        UserId = user.Id
                    },
                    new UserFeedback
                    {
                        FeedbackType = "Bug",
                        Comment = "I want clearer labels on the money categories page.",
                        SubmittedAt = DateTime.UtcNow.AddDays(-1),
                        UserId = user.Id
                    });
            }

            await _context.SaveChangesAsync();
        }
    }
}
