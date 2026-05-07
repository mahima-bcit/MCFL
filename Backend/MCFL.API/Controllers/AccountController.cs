using MCFL.API.Data;
using MCFL.API.DTOs.Admin.AdminSettings;
using MCFL.API.Models;
using MCFL.API.Models.DTOs;
using MCFL.API.Models.Identity;
using MCFL.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AccountController> _logger;
    private readonly AppDbContext _context;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        AppDbContext context,
        ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _context = context;
        _logger = logger;
    }

    [HttpGet("learning-topics")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLearningTopics()
    {
        var topics = await _context.LearningTopics
            .AsNoTracking()
            .Where(t => t.IsActive)
            .OrderBy(t => t.SortOrder)
            .Select(t => new { t.LearningTopicId, t.TopicName })
            .ToListAsync();

        return Ok(topics);
    }

    [HttpGet("belief-definitions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBeliefDefinitions()
    {
        var beliefs = await _context.BeliefDefinitions
            .AsNoTracking()
            .Where(b => b.IsActive)
            .OrderBy(b => b.SortOrder)
            .Select(b => new { b.Key, b.Label })
            .ToListAsync();

        return Ok(beliefs);
    }

    [HttpGet("validate-registration-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ValidateRegistrationEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new { error = "Email is required." });
        }

        var normalizedEmail = email.Trim().ToLowerInvariant();

        var isAllowed = await _context.RegistrationAllowLists
            .AsNoTracking()
            .AnyAsync(x => x.Email.ToLower() == normalizedEmail);

        if (!isAllowed)
        {
            return BadRequest(new { error = "This email is not approved for registration. Please contact support." });
        }

        var existing = await _userManager.FindByEmailAsync(normalizedEmail);

        if (existing != null)
        {
            return BadRequest(new { error = "Email already registered" });
        }

        return Ok(new { allowed = true });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var email = model.Email.Trim().ToLowerInvariant();

        var isAllowed = await _context.RegistrationAllowLists
            .AsNoTracking()
            .AnyAsync(x => x.Email.ToLower() == email);

        if (!isAllowed)
        {
            return BadRequest(new { error = "This email is not approved for registration." });
        }

        var existing = await _userManager.FindByEmailAsync(email);

        if (existing != null)
        {
            return BadRequest(new { error = "Email already registered" });
        }

        if (model.RequiresParentConsent)
        {
            if (model.ParentAuthorization is null ||
                !model.ParentAuthorization.Authorized ||
                string.IsNullOrWhiteSpace(model.ParentAuthorization.ParentGuardianName) ||
                string.IsNullOrWhiteSpace(model.ParentAuthorization.ParentGuardianEmail))
            {
                return BadRequest(new { error = "Parent or guardian authorization is required." });
            }
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = string.IsNullOrWhiteSpace(model.FullName) ? null : model.FullName.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            ParentConsentRequired = model.RequiresParentConsent,
            ParentConsentReceived = model.RequiresParentConsent && model.ParentAuthorization?.Authorized == true,
            OnboardingCompleted = true
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        const string defaultRole = "User";

        var roleResult = await _userManager.AddToRoleAsync(user, defaultRole);

        if (!roleResult.Succeeded)
        {
            var errors = string.Join("; ", roleResult.Errors.Select(e => $"{e.Code}: {e.Description}"));

            _logger.LogError(
                "Failed to assign default role {Role} to user {UserId}. Errors: {Errors}",
                defaultRole,
                user.Id,
                errors);

            await _userManager.DeleteAsync(user);

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "Registration failed while assigning the default role." });
        }

        try
        {
            var profile = new UserProfile
            {
                FullName = string.IsNullOrWhiteSpace(model.FullName) ? string.Empty : model.FullName.Trim(),
                NickName = string.IsNullOrWhiteSpace(model.Nickname) ? null : model.Nickname.Trim(),
                DateOfBirth = model.DateOfBirth,
                ParentTeachingsAnswer = string.IsNullOrWhiteSpace(model.ProfileSetup.ParentsTaughtMoney)
                    ? null
                    : model.ProfileSetup.ParentsTaughtMoney.Trim(),
                LearningComments = string.IsNullOrWhiteSpace(model.ProfileSetup.LearningGoalText)
                    ? null
                    : model.ProfileSetup.LearningGoalText.Trim(),
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync(); // flush to get UserProfileId

            _context.UserFinancialProfiles.Add(new UserFinancialProfile
            {
                UserProfileId = profile.UserProfileId,
                HasBankAccount = model.ProfileSetup.BankAccount.Equals("yes", StringComparison.OrdinalIgnoreCase),
                EarnsMoneyAnswer = NormalizeAnswer(model.ProfileSetup.EarnMoney),
                HasSavingsAnswer = NormalizeAnswer(model.ProfileSetup.HaveSavings),
                PaysBillsAnswer = NormalizeAnswer(model.ProfileSetup.PayBills),
                SpendsOnWantsAnswer = NormalizeAnswer(model.ProfileSetup.SpendOnWants),
                CreatedAt = DateTime.UtcNow
            });

            if (model.RequiresParentConsent && model.ParentAuthorization is not null)
            {
                _context.ParentConsents.Add(new ParentConsent
                {
                    ParentName = model.ParentAuthorization.ParentGuardianName.Trim(),
                    ParentEmail = model.ParentAuthorization.ParentGuardianEmail.Trim().ToLowerInvariant(),
                    ConsentGiven = model.ParentAuthorization.Authorized,
                    ConsentGivenAt = model.ParentAuthorization.Authorized ? DateTime.UtcNow : null,
                    UserId = user.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();

            if (model.ProfileSetup.Beliefs.Count > 0)
            {
                foreach (var (key, answer) in model.ProfileSetup.Beliefs)
                {
                    if (!string.IsNullOrWhiteSpace(key) && !string.IsNullOrWhiteSpace(answer))
                    {
                        _context.UserBeliefs.Add(new UserBelief
                        {
                            UserProfileId = profile.UserProfileId,
                            BeliefKey = key.Trim(),
                            Answer = answer.Trim().ToLowerInvariant(),
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                await _context.SaveChangesAsync();
            }

            var selectedLearningGoals = model.ProfileSetup.LearningGoals
                .Where(goal => !string.IsNullOrWhiteSpace(goal))
                .Select(goal => goal.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (selectedLearningGoals.Count > 0)
            {
                var learningTopics = await _context.LearningTopics
                    .Where(topic => selectedLearningGoals.Contains(topic.TopicName))
                    .ToListAsync();

                foreach (var topic in learningTopics)
                {
                    _context.UserLearningPreferences.Add(new UserLearningPreference
                    {
                        UserProfileId = profile.UserProfileId,
                        LearningTopicId = topic.LearningTopicId,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                await _context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save profile setup for user {UserId}", user.Id);

            await _userManager.DeleteAsync(user);

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "Registration failed while saving profile setup." });
        }

        var token = await _tokenService.CreateTokenAsync(user);

        return Ok(new
        {
            token,
            role = "User"
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var email = model.Email.Trim().ToLowerInvariant();

        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return Unauthorized(new { error = "Invalid credentials" });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            model.Password,
            lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return Unauthorized(new { error = "Invalid credentials" });
        }

        var token = await _tokenService.CreateTokenAsync(user, model.RememberMe);
        var roles = await _userManager.GetRolesAsync(user);

        var role = roles.Contains("Admin") ? "Admin" : "User";

        return Ok(new
        {
            token,
            role,
            mustChangePassword = user.MustChangePassword
        });
    }

    [HttpGet("settings")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AccountSettingsDto>> GetCurrentAdmin()
    {
        var user = await GetCurrentUserAsync();

        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(new AccountSettingsDto
        {
            Email = user.Email ?? "",
            MustChangePassword = user.MustChangePassword
        });
    }

    [HttpPut("password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await GetCurrentUserAsync();

        if (user == null)
        {
            return Unauthorized();
        }

        if (model.CurrentPassword == model.NewPassword)
        {
            return BadRequest(new
            {
                error = "New password must be different from the current password."
            });
        }

        var result = await _userManager.ChangePasswordAsync(
            user,
            model.CurrentPassword,
            model.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                errors = result.Errors.Select(e => e.Description).ToList()
            });
        }

        user.MustChangePassword = false;

        await _userManager.UpdateAsync(user);

        return NoContent();
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync()
    {
        var userId =
            User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return null;
        }

        return await _userManager.FindByIdAsync(userId);
    }

    private static string NormalizeAnswer(string answer)
    {
        return answer.Trim().ToLowerInvariant();
    }
}