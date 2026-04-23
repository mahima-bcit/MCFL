using MCFL.API.Models.DTOs;
using MCFL.API.Models.Identity;
using MCFL.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParentConsentController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<ParentConsentController> _logger;

    public ParentConsentController(
        UserManager<ApplicationUser> userManager,
        IEmailSender emailSender,
        ILogger<ParentConsentController> logger)
    {
        _userManager = userManager;
        _emailSender = emailSender;
        _logger = logger;
    }

    // STEP 1: Send parent consent request email
    [HttpPost("request")]
    [Authorize]
    public async Task<IActionResult> RequestConsent([FromBody] ParentConsentRequestDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByIdAsync(model.UserId);
        if (user == null)
            return NotFound(new { error = "User not found" });

        // Generate token (simple example — can be improved later)
        var token = await _userManager.GenerateUserTokenAsync(
            user,
            TokenOptions.DefaultProvider,
            "ParentConsent");

        var link = $"{model.ConfirmUrl}?userId={user.Id}&token={token}";

        await _emailSender.SendEmailAsync(
            model.ParentEmail,
            "Parent Consent Required",
            $"Please confirm consent: {link}");

        return Ok(new { message = "Consent request sent" });
    }

    // STEP 2: Confirm consent (clicked from email link)
    [HttpGet("confirm")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmConsent([FromQuery] string userId, [FromQuery] string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return BadRequest(new { error = "Invalid request" });

        var isValid = await _userManager.VerifyUserTokenAsync(
            user,
            TokenOptions.DefaultProvider,
            "ParentConsent",
            token);

        if (!isValid)
            return BadRequest(new { error = "Invalid or expired token" });

        // Example: store consent flag (you need this field in ApplicationUser)
        user.ParentConsentReceived = true;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = "Parent consent confirmed" });
    }

    // STEP 3: Check consent status
    [HttpGet("status/{userId}")]
    [Authorize]
    public async Task<IActionResult> GetConsentStatus(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();

        return Ok(new
        {
            userId = user.Id,
            consentGiven = user.ParentConsentReceived
        });
    }
}