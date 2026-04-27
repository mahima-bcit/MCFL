using MCFL.API.DTOs.Admin.Overview;
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

        [HttpGet("parent-feedbacks")]
        public async Task<ActionResult<List<AdminParentFeedbackDto>>> GetParentFeedbacks([FromQuery] string? childName = null)
        {
            var feedbacks = await _adminService.GetParentFeedbacksAsync(childName);
            return Ok(feedbacks);
        }
    }
}
