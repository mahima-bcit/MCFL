using MCFL.API.DTOs.Game;
using MCFL.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

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
            var userId =
            User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
            User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _service.ApplyChoice(userId, request.ScenarioChoiceId);
            return Ok(result);
        }
    }
}