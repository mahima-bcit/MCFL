using MCFL.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MCFL.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserGameStatController : ControllerBase
    {
        private readonly IUserGameStatRepository _repo;

        public UserGameStatController(IUserGameStatRepository repo)
        {
            _repo = repo;
        }

            [HttpGet("current")]
        public async Task<IActionResult> GetCurrent()
        {
            var userId =
                User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Unauthorized();

            var stat = await _repo.GetByUserId(userId);

            if (stat == null)
                return NotFound("User game stat not found");

            return Ok(new
            {
                currentGameMoney = stat.CurrentGameMoney,
                currentConfidenceScore = stat.CurrentConfidenceScore
            });
        }
    }
}