using MCFL.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data.Seed
{
    public class DevelopmentLearningTopicSeeder : IDevelopmentSeeder
    {
        private readonly AppDbContext _context;

        public DevelopmentLearningTopicSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            var topics = new[]
            {
                "How to save money",
                "How to budget",
                "How to invest",
                "How to take care of my money"
            };

            foreach (var topicName in topics)
            {
                var exists = await _context.LearningTopics
                    .AnyAsync(x => x.TopicName == topicName);

                if (!exists)
                {
                    _context.LearningTopics.Add(new LearningTopic
                    {
                        TopicName = topicName,
                        IsActive = true,
                        SortOrder = Array.IndexOf(topics, topicName) + 1
                    });
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
