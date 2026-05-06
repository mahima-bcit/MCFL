using MCFL.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MCFL.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameScenarioController : ControllerBase
    {
        private readonly IGameScenarioService _service;

        public GameScenarioController(IGameScenarioService service)
        {
            _service = service;
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandom(int count = 10)
        {
            var result = await _service.GetRandomScenarios(count);
            return Ok(result);
        }
    }
}