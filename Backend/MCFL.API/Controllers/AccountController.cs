using MCFL.API.Data;
using MCFL.API.DTOs.Admin.AdminSettings;
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

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var email = model.Email.Trim().ToLowerInvariant();

        var isAllowed = await _context.RegistrationAllowLists
            .AsNoTracking()
            .AnyAsync(x => x.Email.ToLower() == email);

        if (!isAllowed)
        {
            return BadRequest(new { error = "This email is not approved for registration." });
        }

        var existing = await _userManager.FindByEmailAsync(email);
        if (existing != null) return BadRequest(new { error = "Email already registered" });

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = string.IsNullOrWhiteSpace(model.FullName) ? null : model.FullName.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

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
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var email = model.Email.Trim().ToLowerInvariant();
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return Unauthorized(new { error = "Invalid credentials" });

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            model.Password,
            lockoutOnFailure: false
        );

        if (!result.Succeeded) return Unauthorized(new { error = "Invalid credentials" });

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
}