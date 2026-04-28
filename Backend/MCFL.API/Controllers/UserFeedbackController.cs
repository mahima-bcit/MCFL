using MCFL.API.Data;
using MCFL.API.Models;
using MCFL.API.Models.DTOs;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserFeedbackController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserFeedbackController(AppDbContext db, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] UserFeedbackRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = _userManager.GetUserId(User);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { error = "Authenticated user not found." });

        var feedbackType = await _db.UserFeedbackTypes
            .FirstOrDefaultAsync(t => t.Name == dto.FeedbackType.Trim() && t.IsActive);

        if (feedbackType == null)
            return BadRequest(new { error = "Invalid feedback type." });

        var feedback = new UserFeedback
        {
            UserFeedbackTypeId = feedbackType.UserFeedbackTypeId,
            Comment = dto.Comment.Trim(),
            UserId = userId,
            SubmittedAt = DateTime.UtcNow,
        };

        _db.UserFeedbacks.Add(feedback);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Feedback submitted successfully." });
    }
}