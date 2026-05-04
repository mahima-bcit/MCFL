using MCFL.API.Data;
using MCFL.API.Models;
using MCFL.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParentFeedbackController : ControllerBase
{
    private readonly AppDbContext _db;

    public ParentFeedbackController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("info")]
    [AllowAnonymous]
    public async Task<IActionResult> GetInfo([FromQuery] string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return BadRequest(new { error = "Token is required." });

        var accessLink = await _db.ParentAccessLinks
            .FirstOrDefaultAsync(l => l.Token == token && l.IsActive);

        if (accessLink == null)
            return BadRequest(new { error = "Invalid or expired access link." });

        if (accessLink.ExpiresAt.HasValue && accessLink.ExpiresAt < DateTime.UtcNow)
            return BadRequest(new { error = "This access link has expired." });

        var profile = await _db.UserProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == accessLink.UserId);

        var childName = profile?.FullName ?? "your child";

        return Ok(new { childName });
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Submit([FromBody] ParentFeedbackRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var accessLink = await _db.ParentAccessLinks
            .FirstOrDefaultAsync(l => l.Token == dto.Token && l.IsActive);

        if (accessLink == null)
            return BadRequest(new { error = "Invalid or expired access link." });

        if (accessLink.ExpiresAt.HasValue && accessLink.ExpiresAt < DateTime.UtcNow)
            return BadRequest(new { error = "This access link has expired." });

        var feedback = new ParentFeedback
        {
            ParentEmail = dto.ParentEmail.Trim(),
            ParentName = dto.ParentName?.Trim(),
            MoneyStory = dto.MoneyStory.Trim(),
            WhatChildShouldLearn = dto.WhatChildShouldLearn.Trim(),
            ParentAccessLinkId = accessLink.ParentAccessLinkId,
            SubmittedAt = DateTime.UtcNow,
        };

        _db.ParentFeedbacks.Add(feedback);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Feedback submitted successfully." });
    }
}
