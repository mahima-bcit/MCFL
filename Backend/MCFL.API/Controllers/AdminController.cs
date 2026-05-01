using MCFL.API.DTOs.Admin.AccessControl;
using MCFL.API.DTOs.Admin.Feedbacks;
using MCFL.API.DTOs.Admin.Feelings;
using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Scenarios;
using MCFL.API.DTOs.Admin.Users;
using MCFL.API.DTOs.Feedbacks;
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
        public async Task<ActionResult<List<AdminUserListItemDto>>> GetUsers([FromQuery] string? search = null)
        {
            var users = await _adminService.GetUsersAsync(search);
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

        [HttpGet("user-feedback")]
        public async Task<ActionResult<List<AdminUserFeedbackDto>>> GetUserFeedback(
            [FromQuery] string? feedbackType,
            [FromQuery] string? email,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var today = DateTime.Today;

            if (startDate.HasValue && startDate.Value.Date > today)
            {
                return BadRequest("From date cannot be after today's date.");
            }

            if (endDate.HasValue && endDate.Value.Date > today)
            {
                return BadRequest("To date cannot be after today's date.");
            }

            if (startDate.HasValue &&
                endDate.HasValue &&
                startDate.Value.Date > endDate.Value.Date)
            {
                return BadRequest("From date cannot be after To date.");
            }

            var feedback = await _adminService.GetUserFeedbackAsync(
                feedbackType,
                email,
                startDate,
                endDate);

            return Ok(feedback);
        }

        [HttpGet("user-feedback/types")]
        public async Task<ActionResult<List<string>>> GetUserFeedbackTypes()
        {
            var types = await _adminService.GetUserFeedbackTypesAsync();
            return Ok(types);
        }

        [HttpGet("parent-feedbacks")]
        public async Task<ActionResult<List<AdminParentFeedbackDto>>> GetParentFeedbacks(
            [FromQuery] string? childName = null)
        {
            var feedbacks = await _adminService.GetParentFeedbacksAsync(childName);
            return Ok(feedbacks);
        }

        [HttpGet("access-control/allowlist")]
        public async Task<ActionResult<List<AdminAllowedRegistrationEmailDto>>> GetAllowedRegistrationEmails()
        {
            var emails = await _adminService.GetAllowedRegistrationEmailsAsync();
            return Ok(emails);
        }

        [HttpPost("access-control/allowlist")]
        public async Task<ActionResult<AdminAllowedRegistrationEmailDto>> AddAllowedRegistrationEmail(
            [FromBody] AddAllowedRegistrationEmailRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var created = await _adminService.AddAllowedRegistrationEmailAsync(request);
                return Ok(created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("access-control/allowlist/{id:int}")]
        public async Task<IActionResult> DeleteAllowedRegistrationEmail(int id)
        {
            var deleted = await _adminService.DeleteAllowedRegistrationEmailAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("scenarios")]
        public async Task<ActionResult<AdminScenariosDto>> GetScenarios(
            [FromQuery] string? range = "allTime",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var scenarios = await _adminService.GetScenariosAsync(range, startDate, endDate);
                return Ok(scenarios);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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

        [HttpGet("money-feelings")]
        public async Task<ActionResult<List<AdminMoneyFeelingDto>>> GetMoneyFeelings(
            [FromQuery] string? feeling,
            [FromQuery] string? email,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var today = DateTime.Today;

            if (startDate.HasValue && startDate.Value.Date > today)
            {
                return BadRequest("From date cannot be after today's date.");
            }

            if (endDate.HasValue && endDate.Value.Date > today)
            {
                return BadRequest("To date cannot be after today's date.");
            }

            if (startDate.HasValue &&
                endDate.HasValue &&
                startDate.Value.Date > endDate.Value.Date)
            {
                return BadRequest("From date cannot be after To date.");
            }

            var result = await _adminService.GetMoneyFeelingsAsync(feeling, email, startDate, endDate);

            return Ok(result);
        }
    }
}