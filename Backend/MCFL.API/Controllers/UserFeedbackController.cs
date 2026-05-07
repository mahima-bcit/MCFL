using MCFL.API.Data;
using MCFL.API.Models;
using MCFL.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class UserFeedbackController : ControllerBase
{
    private readonly AppDbContext _db;

    public UserFeedbackController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("types")]
    public async Task<IActionResult> GetTypes()
    {
        var types = await _db.UserFeedbackTypes
            .Where(t => t.IsActive)
            .OrderBy(t => t.SortOrder)
            .Select(t => t.Name)
            .ToListAsync();

        return Ok(types);
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] UserFeedbackRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { error = "Authenticated user not found." });

        var feedbackType = await _db.UserFeedbackTypes
            .FirstOrDefaultAsync(t => t.Name == dto.FeedbackType.Trim() && t.IsActive);

        if (feedbackType == null)
            return BadRequest(new { error = "Invalid feedback type." });

        var feedback = new UserFeedback
        {
            UserFeedbackTypeId = feedbackType.UserFeedbackTypeId,
            Comment = dto.Comment?.Trim() ?? string.Empty,
            UserId = userId,
            SubmittedAt = DateTime.UtcNow,
        };

        _db.UserFeedbacks.Add(feedback);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Feedback submitted successfully." });
    }
}