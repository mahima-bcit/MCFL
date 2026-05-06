using MCFL.API.Models;

namespace MCFL.API.Repositories
{
    public interface IGameScenarioRepository
    {
        Task<object> GetRandomScenarios(int count);

        Task<ScenarioChoice?> GetChoiceById(int choiceId);
    }
}