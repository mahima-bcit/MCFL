namespace MCFL.API.Services
{
    public interface IGameScenarioService
    {
        Task<object> GetRandomScenarios(int count);
    }
}
