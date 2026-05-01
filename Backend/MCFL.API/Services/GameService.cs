using MCFL.API.Models;
using MCFL.API.Repositories;

namespace MCFL.API.Services
{
    public class GameService
    {
        private readonly IGameScenarioRepository _scenarioRepo;
        private readonly IUserGameStatRepository _statRepo;

        public GameService(
            IGameScenarioRepository scenarioRepo,
            IUserGameStatRepository statRepo)
        {
            _scenarioRepo = scenarioRepo;
            _statRepo = statRepo;
        }

        // 👇 YOUR METHOD GOES HERE
        public async Task<object> ApplyChoice(string userId, int choiceId)
        {
            var choice = await _scenarioRepo.GetChoiceById(choiceId);
            var stat = await _statRepo.GetByUserId(userId);

            if (stat == null)
            //throw new Exception("User game stat not found");
            {
                stat = new UserGameStat
                {
                    UserId = userId,
                    CurrentGameMoney = 0,
                    CurrentConfidenceScore = 0,
                    UpdatedAt = DateTime.UtcNow
                };

                await _statRepo.Add(stat); // 👈 you need this method
            }


            stat.CurrentGameMoney += choice.MoneyImpact;
            stat.CurrentConfidenceScore += choice.ConfidenceImpact;
            stat.UpdatedAt = DateTime.UtcNow;

            await _statRepo.Update(stat);

            return new
            {
                money = stat.CurrentGameMoney,
                confidence = stat.CurrentConfidenceScore,
                resultText = choice.ResultText
            };
        }
    }
}