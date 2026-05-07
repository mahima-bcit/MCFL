using MCFL.API.Data;
using MCFL.API.Models;
using MCFL.API.Repositories;

namespace MCFL.API.Services
{
    public class GameService
    {
        private readonly IGameScenarioRepository _scenarioRepo;
        private readonly IUserGameStatRepository _statRepo;
        private readonly AppDbContext _context;

        public GameService(
            IGameScenarioRepository scenarioRepo,
            IUserGameStatRepository statRepo,
            AppDbContext context)
        {
            _scenarioRepo = scenarioRepo;
            _statRepo = statRepo;
            _context = context;
        }


        public async Task<object?> ApplyChoice(string userId, int choiceId)
        {
            var choice = await _scenarioRepo.GetChoiceById(choiceId);
            if (choice == null) return null;

            var stat = await _statRepo.GetByUserId(userId);

            if (stat == null)
            {
                stat = new UserGameStat
                {
                    UserId = userId,
                    CurrentGameMoney = 0,
                    CurrentConfidenceScore = 0,
                    UpdatedAt = DateTime.UtcNow
                };

                await _statRepo.Add(stat);
            }

            var moneyBefore = stat.CurrentGameMoney;
            var confidenceBefore = stat.CurrentConfidenceScore;

            stat.CurrentGameMoney += choice.MoneyImpact;
            stat.CurrentConfidenceScore = Math.Max(0, Math.Min(100, stat.CurrentConfidenceScore + choice.ConfidenceImpact));
            stat.UpdatedAt = DateTime.UtcNow;

            await _statRepo.Update(stat);

            _context.ScenarioPlays.Add(new ScenarioPlay
            {
                UserId = userId,
                ScenarioId = choice.ScenarioId,
                ScenarioChoiceId = choiceId,
                PlayedAt = DateTime.UtcNow,
                GameMoneyBefore = moneyBefore,
                GameMoneyAfter = stat.CurrentGameMoney,
                ConfidenceBefore = confidenceBefore,
                ConfidenceAfter = stat.CurrentConfidenceScore,
                MoneyImpactSnapshot = choice.MoneyImpact,
                ConfidenceImpactSnapshot = choice.ConfidenceImpact,
                LessonTextSnapshot = choice.LessonText
            });
            await _context.SaveChangesAsync();

            return new
            {
                currentGameMoney = stat.CurrentGameMoney,
                currentConfidenceScore = stat.CurrentConfidenceScore
            };
        }
    }
}