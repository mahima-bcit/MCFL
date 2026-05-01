using MCFL.API.DTOs.Game;
using MCFL.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MCFL.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameService _service;

        public GameController(GameService service)
        {
            _service = service;
        }

        [HttpPost("choice")]
        public async Task<IActionResult> ApplyChoice([FromBody] ApplyChoiceRequest request)
        {
            var result = await _service.ApplyChoice(request.UserId, request.ScenarioChoiceId);
            return Ok(result);
        }
    }
}