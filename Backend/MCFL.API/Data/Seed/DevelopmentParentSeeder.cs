using MCFL.API.Models;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentParentSeeder : IDevelopmentSeeder
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DevelopmentParentSeeder(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task SeedAsync()
        {
            var minorEmails = new[] { "mahima@mcfl.local", "saman@mcfl.local", "harry@mcfl.local" };

            foreach (var email in minorEmails)
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null) continue;

                var consent = await _context.ParentConsents.FirstOrDefaultAsync(x => x.UserId == user.Id);
                if (consent == null)
                {
                    consent = new ParentConsent
                    {
                        ParentName = email switch
                        {
                            "mahima@mcfl.local" => "Maria Carter",
                            "saman@mcfl.local" => "Kevin Lee",
                            "harry@mcfl.local" => "Nina Brooks",
                            _ => "Parent Guardian"
                        },
                        ParentEmail = email switch
                        {
                            "mahima@mcfl.local" => "maria.parent@mcfl.local",
                            "saman@mcfl.local" => "kevin.parent@mcfl.local",
                            "harry@mcfl.local" => "nina.parent@mcfl.local",
                            _ => "parent@mcfl.local"
                        },
                        ConsentGiven = user.ParentConsentReceived,
                        ConsentGivenAt = user.ParentConsentReceived ? DateTime.UtcNow.AddDays(-20) : null,
                        CreatedAt = DateTime.UtcNow.AddDays(-20),
                        UserId = user.Id
                    };

                    _context.ParentConsents.Add(consent);
                }

                var accessLink = await _context.ParentAccessLinks.FirstOrDefaultAsync(x => x.UserId == user.Id);
                if (accessLink == null)
                {
                    accessLink = new ParentAccessLink
                    {
                        Token = Guid.NewGuid().ToString("N"),
                        IsActive = true,
                        ExpiresAt = DateTime.UtcNow.AddDays(14),
                        CreatedAt = DateTime.UtcNow.AddDays(-3),
                        UserId = user.Id
                    };

                    _context.ParentAccessLinks.Add(accessLink);
                    await _context.SaveChangesAsync();
                }

                var hasFeedback = await _context.ParentFeedbacks.AnyAsync(x => x.ParentAccessLinkId == accessLink.ParentAccessLinkId);
                if (!hasFeedback)
                {
                    _context.ParentFeedbacks.Add(new ParentFeedback
                    {
                        ParentEmail = consent.ParentEmail,
                        ParentName = consent.ParentName,
                        MoneyStory = "We try to talk openly about spending and saving at home.",
                        WhatChildShouldLearn = "How to pause before spending and plan for goals.",
                        SubmittedAt = DateTime.UtcNow.AddDays(-1),
                        ParentAccessLinkId = accessLink.ParentAccessLinkId
                    });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
