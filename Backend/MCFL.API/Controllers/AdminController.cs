using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Scenarios;
using MCFL.API.DTOs.Admin.Users;
using MCFL.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MCFL.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("overview")]
        public async Task<ActionResult<AdminOverviewDto>> GetOverview(
            [FromQuery] string? range = "last30Days",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var result = await _adminService.GetOverviewAsync(range, startDate, endDate);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<AdminUserListItemDto>>> GetUsers()
        {
            var users = await _adminService.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<AdminUserDetailDto>> GetUserById(string id)
        {
            var user = await _adminService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("scenarios")]
        public async Task<ActionResult<AdminScenariosDto>> GetScenarios()
        {
            var scenarios = await _adminService.GetScenariosAsync();
            return Ok(scenarios);
        }

        [HttpGet("scenarios/manage")]
        public async Task<ActionResult<List<AdminManageScenarioDto>>> GetManageScenarios()
        {
            var scenarios = await _adminService.GetManageScenariosAsync();
            return Ok(scenarios);
        }

        [HttpPost("scenarios/manage")]
        public async Task<ActionResult<AdminManageScenarioDto>> CreateScenario(
            [FromBody] AdminUpsertScenarioRequestDto request)
        {
            try
            {
                var created = await _adminService.CreateScenarioAsync(request);
                return Ok(created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("scenarios/manage/{scenarioId:int}")]
        public async Task<ActionResult<AdminManageScenarioDto>> UpdateScenario(
            int scenarioId,
            [FromBody] AdminUpsertScenarioRequestDto request)
        {
            try
            {
                var updated = await _adminService.UpdateScenarioAsync(scenarioId, request);
                if (updated == null)
                {
                    return NotFound();
                }

                return Ok(updated);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("scenarios/manage/{scenarioId:int}/activate")]
        public async Task<IActionResult> ActivateScenario(int scenarioId)
        {
            var activated = await _adminService.ActivateScenarioAsync(scenarioId);
            if (!activated)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("scenarios/manage/{scenarioId:int}")]
        public async Task<IActionResult> DeactivateScenario(int scenarioId)
        {
            var deactivated = await _adminService.DeactivateScenarioAsync(scenarioId);
            if (!deactivated)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
