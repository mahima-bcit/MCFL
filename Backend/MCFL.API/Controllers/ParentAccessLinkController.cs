using System.Security.Claims;
using MCFL.API.Data;
using MCFL.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MCFL.API.Models.Identity;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParentAccessLinkController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public ParentAccessLinkController(AppDbContext db, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // Child regenerates their own parent feedback link
    [HttpPost("regenerate")]
    [Authorize]
    public async Task<IActionResult> Regenerate()
    {
        var user = await _userManager.GetUserAsync(User)
            ?? await _userManager.FindByIdAsync(
                User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "");

        if (user == null)
            return Unauthorized(new { error = "User not found." });

        var existing = await _db.ParentAccessLinks
            .Where(l => l.UserId == user.Id && l.IsActive)
            .ToListAsync();

        foreach (var link in existing)
            link.IsActive = false;

        var token = Guid.NewGuid().ToString("N");
        _db.ParentAccessLinks.Add(new ParentAccessLink
        {
            Token = token,
            IsActive = true,
            ExpiresAt = null,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
        });

        await _db.SaveChangesAsync();

        return Ok(new { token });
    }

    // Admin creates an access link for a given user (child account)
    [HttpPost("generate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Generate([FromBody] GenerateAccessLinkRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
            return NotFound(new { error = "User not found." });

        var token = Guid.NewGuid().ToString("N");

        var link = new ParentAccessLink
        {
            Token = token,
            IsActive = true,
            ExpiresAt = request.ExpiresAt,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
        };

        _db.ParentAccessLinks.Add(link);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            token,
            expiresAt = link.ExpiresAt,
            userId = user.Id,
        });
    }

    // Admin deactivates an access link by token
    [HttpDelete("{token}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deactivate(string token)
    {
        var link = await _db.ParentAccessLinks.FirstOrDefaultAsync(l => l.Token == token);
        if (link == null)
            return NotFound(new { error = "Access link not found." });

        link.IsActive = false;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Access link deactivated." });
    }
}

public class GenerateAccessLinkRequest
{
    public string UserId { get; set; } = null!;
    public DateTime? ExpiresAt { get; set; }
}
