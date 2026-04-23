using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using MCFL.API.Models.Identity;
using MCFL.API.Models.DTOs;
using MCFL.API.Services;

namespace MCFL.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _logger = logger;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var existing = await _userManager.FindByEmailAsync(model.Email);
        if (existing != null) return BadRequest(new { error = "Email already registered" });

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // assign default role (ensure the RoleSeeder creates "User")
        await _userManager.AddToRoleAsync(user, "User");

        var token = await _tokenService.CreateTokenAsync(user);
        return Ok(new { token });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null) return Unauthorized(new { error = "Invalid credentials" });

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);
        if (!result.Succeeded) return Unauthorized(new { error = "Invalid credentials" });

        var token = await _tokenService.CreateTokenAsync(user, model.RememberMe);
        return Ok(new { token });
    }
}