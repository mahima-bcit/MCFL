using MCFL.API.Repositories;

namespace MCFL.API.Services
{
    public class GameScenarioService : IGameScenarioService
    {
        private readonly IGameScenarioRepository _repo;

        public GameScenarioService(IGameScenarioRepository repo)
        {
            _repo = repo;
        }

        public async Task<object> GetRandomScenarios(int count)
        {
            return await _repo.GetRandomScenarios(count);
        }
    }
}
