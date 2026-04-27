using System.Net;
using MCFL.API.Models.DTOs;
using MCFL.API.Models.Identity;
using MCFL.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParentConsentController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<ParentConsentController> _logger;
    private readonly IConfiguration _configuration;

    public ParentConsentController(
        UserManager<ApplicationUser> userManager,
        IEmailSender emailSender,
        ILogger<ParentConsentController> logger,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _emailSender = emailSender;
        _logger = logger;
        _configuration = configuration;
    }

    // STEP 1: Send parent consent request email
    [HttpPost("request")]
    [Authorize]
    public async Task<IActionResult> RequestConsent([FromBody] ParentConsentRequestDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.GetUserAsync(User);

        if (user == null)
        {
            return Unauthorized(new { error = "Authenticated user not found" });
        }

        var token = await _userManager.GenerateUserTokenAsync(
            user,
            TokenOptions.DefaultProvider,
            "ParentConsent");

        var consentConfirmUrl = _configuration.GetValue<string>("Frontend:ConsentConfirmUrl");

        if (string.IsNullOrWhiteSpace(consentConfirmUrl))
        {
            _logger.LogError("Frontend:ConsentConfirmUrl is missing.");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "Consent confirmation URL is not configured." });
        }

        var link = QueryHelpers.AddQueryString(
            consentConfirmUrl,
            new Dictionary<string, string?>
            {
                ["userId"] = user.Id,
                ["token"] = token
            });

        var parentName = WebUtility.HtmlEncode(model.ParentName.Trim());
        var safeLink = WebUtility.HtmlEncode(link);

        await _emailSender.SendEmailAsync(
            model.ParentEmail,
            "Parent Consent Required",
            $"""
            <p>Hello {parentName},</p>
            <p>Please confirm parent consent for MCFL.</p>
            <p><a href="{safeLink}">Confirm parent consent</a></p>
            """);

        return Ok(new { message = "Consent request sent" });
    }

    // STEP 2: Confirm consent from email link
    [HttpGet("confirm")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmConsent(
        [FromQuery] string userId,
        [FromQuery] string token)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
        {
            return BadRequest(new { error = "Invalid request" });
        }

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

        user.ParentConsentReceived = true;

        var updateResult = await _userManager.UpdateAsync(user);

        if (!updateResult.Succeeded)
        {
            _logger.LogWarning(
                "Failed to confirm parent consent for user {UserId}. Errors: {Errors}",
                user.Id,
                string.Join("; ", updateResult.Errors.Select(e => e.Description)));

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "Failed to confirm parent consent" });
        }

        return Ok(new { message = "Parent consent confirmed" });
    }

    // STEP 3: Check consent status
    [HttpGet("status/{userId}")]
    [Authorize]
    public async Task<IActionResult> GetConsentStatus(string userId)
    {
        var currentUserId = _userManager.GetUserId(User);

        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized(new { error = "Authenticated user not found" });
        }

        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && !string.Equals(currentUserId, userId, StringComparison.Ordinal))
        {
            return Forbid();
        }

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