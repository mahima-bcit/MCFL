using System.Security.Claims;
using MCFL.API.Data;
using MCFL.API.DTOs.Goal;
using MCFL.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Controllers;

[Authorize]
[ApiController]
[Route("api/goals")]
public class GoalController : ControllerBase
{
    private readonly AppDbContext _db;

    public GoalController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("active")]
    public async Task<ActionResult<ActiveGoalResponse>> GetActiveGoal()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var goal = await _db.LearningSavingsGoals
            .AsNoTracking()
            .Where(g => g.UserId == userId && g.IsActive)
            .OrderByDescending(g => g.CreatedAt)
            .FirstOrDefaultAsync();

        if (goal == null)
            return NoContent();

        return Ok(ToResponse(goal));
    }

    [HttpPost]
    public async Task<ActionResult<ActiveGoalResponse>> CreateGoal([FromBody] CreateGoalRequest request)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var existingGoals = await _db.LearningSavingsGoals
            .Where(g => g.UserId == userId && g.IsActive)
            .ToListAsync();

        foreach (var existing in existingGoals)
        {
            existing.IsActive = false;
            existing.UpdatedAt = DateTime.UtcNow;
        }

        var goal = new LearningSavingsGoal
        {
            UserId = userId,
            GoalTitle = request.GoalTitle.Trim(),
            TargetAmount = request.TargetAmount,
            CurrentSavedAmount = 0,
            TargetDate = request.TargetDate,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.LearningSavingsGoals.Add(goal);
        await _db.SaveChangesAsync();

        return Ok(ToResponse(goal));
    }

    private string? GetCurrentUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

    private static ActiveGoalResponse ToResponse(LearningSavingsGoal goal) => new()
    {
        GoalId = goal.LearningSavingsGoalId,
        GoalTitle = goal.GoalTitle,
        TargetAmount = goal.TargetAmount,
        CurrentSavedAmount = goal.CurrentSavedAmount ?? 0,
        TargetDate = goal.TargetDate,
        CreatedAt = goal.CreatedAt
    };
}
