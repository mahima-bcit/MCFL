using MCFL.API.DTOs.Admin.AccessControl;
using MCFL.API.DTOs.Admin.Overview;
using MCFL.API.DTOs.Admin.Users;
using MCFL.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MCFL.API.Controllers
{
    //[Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
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
    }
}
