using MCFL.API.Data;
using MCFL.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Repositories

{
    public class GameScenarioRepository : IGameScenarioRepository
    {
        private readonly AppDbContext _context;

        public GameScenarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ScenarioChoice?> GetChoiceById(int choiceId)
        {
            return await _context.ScenarioChoices
                .FirstOrDefaultAsync(c => c.ScenarioChoiceId == choiceId && c.IsActive);
        }

        public async Task<object> GetRandomScenarios(int count)
        {
            var scenarios = await _context.Scenarios
                .Where(s => s.IsActive)
                .Include(s => s.ScenarioChoices)
                .ToListAsync();

            var randomScenarios = scenarios
                .OrderBy(x => Guid.NewGuid())
                .Take(count)
                .Select(s => new
                {
                    id = s.ScenarioId,
                    title = s.Title,
                    description = s.Description,
                    choices = s.ScenarioChoices
                        .Where(c => c.IsActive)
                        .OrderBy(c => c.SortOrder)
                        .Select(c => new
                        {
                            id = c.ScenarioChoiceId,
                            optionText = c.OptionText,
                            resultText = c.ResultText,
                            lessonText = c.LessonText,
                            moneyImpact = c.MoneyImpact,
                            confidenceImpact = c.ConfidenceImpact
                        })
                });

            return randomScenarios;
        }
    }
}
