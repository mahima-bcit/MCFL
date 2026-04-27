using MCFL.API.DTOs.Admin.Feedbacks;
using MCFL.API.DTOs.Admin.Overview;
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

            if (startDate.HasValue && endDate.HasValue &&
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
    }
}
