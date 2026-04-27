using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MCFL.API.Data;
using MCFL.API.DTOs.Dashboard;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Controllers;

[Authorize]
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public DashboardController(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _context = context;
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var user = await GetCurrentUserAsync();

        if (user == null)
        {
            return Unauthorized(new { error = "User not found. Please log in again." });
        }

        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1);
        var nextMonthStart = monthStart.AddMonths(1);

        var profile = await _context.UserProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == user.Id);

        var userName = GetDisplayName(user, profile);

        var gameStat = await _context.UserGameStats
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == user.Id);

        var activeGoal = await _context.LearningSavingsGoals
            .AsNoTracking()
            .Where(x => x.UserId == user.Id && x.IsActive)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        var allMoneyEntries = await _context.MoneyEntries
            .AsNoTracking()
            .Include(x => x.CashInCategory)
            .Include(x => x.CashOutCategory)
            .Where(x => x.UserId == user.Id)
            .ToListAsync();

        var monthlyEntries = allMoneyEntries
            .Where(x => x.CreatedAt >= monthStart && x.CreatedAt < nextMonthStart)
            .ToList();

        var monthlyIncome = monthlyEntries
            .Where(x => x.EntryType == "CashIn")
            .Sum(x => x.Amount);

        var monthlyExpenses = monthlyEntries
            .Where(x => x.EntryType == "CashOut")
            .Sum(x => x.Amount);

        var monthlyNet = monthlyIncome - monthlyExpenses;

        var totalIncome = allMoneyEntries
            .Where(x => x.EntryType == "CashIn")
            .Sum(x => x.Amount);

        var totalExpenses = allMoneyEntries
            .Where(x => x.EntryType == "CashOut")
            .Sum(x => x.Amount);

        var availableBalance = totalIncome - totalExpenses;

        var cashOutEntries = allMoneyEntries
            .Where(x => x.EntryType == "CashOut")
            .ToList();

        var wantTotal = cashOutEntries
            .Where(x =>
                IsCategory(x.CashOutCategory?.CategoryName, "Want") ||
                IsCategory(x.CashOutCategory?.CategoryName, "Have"))
            .Sum(x => x.Amount);

        var needTotal = cashOutEntries
            .Where(x => IsCategory(x.CashOutCategory?.CategoryName, "Need"))
            .Sum(x => x.Amount);

        var funTotal = cashOutEntries
            .Where(x => IsCategory(x.CashOutCategory?.CategoryName, "Fun"))
            .Sum(x => x.Amount);

        var saveTotal = cashOutEntries
            .Where(x => IsCategory(x.CashOutCategory?.CategoryName, "Save"))
            .Sum(x => x.Amount);

        var recentPlay = await _context.ScenarioPlays
            .AsNoTracking()
            .Include(x => x.Scenario)
            .Include(x => x.ScenarioChoice)
            .Where(x => x.UserId == user.Id)
            .OrderByDescending(x => x.PlayedAt)
            .FirstOrDefaultAsync();

        var parentAccessLink = await _context.ParentAccessLinks
            .AsNoTracking()
            .Where(x =>
                x.UserId == user.Id &&
                x.IsActive &&
                (x.ExpiresAt == null || x.ExpiresAt > now))
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        var parentFeedbackUrl = BuildParentFeedbackUrl(userName, parentAccessLink?.Token);

        var result = new DashboardSummaryDto
        {
            GameBalance = gameStat?.CurrentGameMoney ?? 0,
            Confidence = gameStat?.CurrentConfidenceScore ?? 0,

            GoalCurrent = activeGoal?.CurrentSavedAmount ?? 0,
            GoalTarget = activeGoal?.TargetAmount ?? 0,
            GoalDueLabel = FormatGoalDate(activeGoal?.TargetDate),

            MonthlyNet = monthlyNet,

            GameMoneyPicture = new GameMoneyPictureDto
            {
                Want = wantTotal,
                Need = needTotal,
                Fun = funTotal,
                Save = saveTotal
            },

            RealMoneySnapshot = new RealMoneySnapshotDto
            {
                AvailableBalance = availableBalance,
                MonthlyIncome = monthlyIncome,
                MonthlyExpenses = monthlyExpenses,
                MonthlyNet = monthlyNet
            },

            ParentFeedback = new ParentFeedbackLinkDto
            {
                Name = userName,
                Link = parentFeedbackUrl
            },

            RecentScenario = recentPlay == null
                ? new RecentScenarioDto()
                : new RecentScenarioDto
                {
                    Title = recentPlay.Scenario.Title,
                    Description = recentPlay.ScenarioChoice.ResultText,
                    MoneyImpact = recentPlay.MoneyImpactSnapshot,
                    ConfidenceBoost = recentPlay.ConfidenceImpactSnapshot
                }
        };

        return Ok(result);
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user != null)
        {
            return user;
        }

        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier) ??
            User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return null;
        }

        return await _userManager.FindByIdAsync(userId);
    }

    private static string GetDisplayName(ApplicationUser user, MCFL.API.Models.UserProfile? profile)
    {
        if (!string.IsNullOrWhiteSpace(profile?.FullName))
        {
            return profile.FullName;
        }

        if (!string.IsNullOrWhiteSpace(user.FullName))
        {
            return user.FullName;
        }

        if (!string.IsNullOrWhiteSpace(user.Email))
        {
            return user.Email.Split('@')[0];
        }

        return "Student";
    }

    private static bool IsCategory(string? actual, string expected)
    {
        return string.Equals(actual, expected, StringComparison.OrdinalIgnoreCase);
    }

    private static string FormatGoalDate(DateOnly? targetDate)
    {
        if (targetDate == null)
        {
            return "No target date";
        }

        var date = targetDate.Value.ToDateTime(TimeOnly.MinValue);

        return date.ToString("MMMM yyyy", CultureInfo.InvariantCulture);
    }

    private string BuildParentFeedbackUrl(string userName, string? token)
    {
        var frontendBaseUrl =
            _configuration.GetValue<string>("Frontend:BaseUrl") ??
            _configuration.GetValue<string>("ClientApp:BaseUrl") ??
            "http://localhost:5173";

        var query = new Dictionary<string, string?>
        {
            ["username"] = userName
        };

        if (!string.IsNullOrWhiteSpace(token))
        {
            query["token"] = token;
        }

        var queryString = string.Join(
            "&",
            query
                .Where(x => !string.IsNullOrWhiteSpace(x.Value))
                .Select(x => $"{Uri.EscapeDataString(x.Key)}={Uri.EscapeDataString(x.Value!)}"));

        return $"{frontendBaseUrl.TrimEnd('/')}/parentFeedback?{queryString}";
    }
}