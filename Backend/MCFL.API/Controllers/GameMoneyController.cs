using System.Security.Claims;
using MCFL.API.Data;
using MCFL.API.DTOs.GameMoney;
using MCFL.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Controllers;

[ApiController]
[Authorize]
[Route("api/game-money")]
public class GameMoneyController : ControllerBase
{
    private readonly AppDbContext _db;

    public GameMoneyController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<GameMoneySummaryResponse>> GetSummary()
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var categoryNames = await _db.CashOutCategories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .Select(c => c.CategoryName)
            .ToListAsync();

        var allEntries = await _db.MoneyEntries
            .AsNoTracking()
            .Include(entry => entry.CashOutCategory)
            .Where(entry => entry.UserId == userId)
            .ToListAsync();

        var cashInTotal = allEntries
            .Where(entry => entry.EntryType == "CashIn")
            .Sum(entry => entry.Amount);

        var cashOutTotal = allEntries
            .Where(entry => entry.EntryType == "CashOut")
            .Sum(entry => entry.Amount);

        var have = cashInTotal - cashOutTotal;

        var cashOutEntries = allEntries
            .Where(entry =>
                entry.EntryType == "CashOut" &&
                entry.CashOutCategory != null &&
                categoryNames.Contains(entry.CashOutCategory.CategoryName))
            .ToList();

        var want = GetCategoryTotal(cashOutEntries, "Want");
        var need = GetCategoryTotal(cashOutEntries, "Need");
        var fun = GetCategoryTotal(cashOutEntries, "Fun");
        var save = GetCategoryTotal(cashOutEntries, "Save");

        var items = new List<GameMoneyItemResponse>
        {
            new()
            {
                Id = 1,
                Category = "Want",
                Amount = want,
                Note = "Money used for wants"
            },
            new()
            {
                Id = 2,
                Category = "Need",
                Amount = need,
                Note = "Money used for needs"
            },
            new()
            {
                Id = 3,
                Category = "Fun",
                Amount = fun,
                Note = "Money used for fun"
            },
            new()
            {
                Id = 4,
                Category = "Save",
                Amount = save,
                Note = "Money saved for later"
            }
        };

        var latestScenarioPlay = await _db.ScenarioPlays
            .AsNoTracking()
            .Include(play => play.Scenario)
            .Where(play => play.UserId == userId)
            .OrderByDescending(play => play.PlayedAt)
            .FirstOrDefaultAsync();

        var response = new GameMoneySummaryResponse
        {
            Items = items,
            Totals = new GameMoneyTotalsResponse
            {
                Have = have,
                Want = want,
                Need = need,
                Fun = fun,
                Save = save,
                Total = want + need + fun + save
            },
            RecentScenario = latestScenarioPlay is null || latestScenarioPlay.Scenario is null
                ? null
                : new GameMoneyRecentScenarioResponse
                {
                    Title = latestScenarioPlay.Scenario.Title,
                    Description = latestScenarioPlay.LessonTextSnapshot,
                    MoneyImpact = latestScenarioPlay.MoneyImpactSnapshot,
                    ConfidenceBoost = latestScenarioPlay.ConfidenceImpactSnapshot
                }
        };

        return Ok(response);
    }

    [HttpGet("feelings")]
    public async Task<ActionResult<List<string>>> GetFeelings()
    {
        var feelings = await _db.MoneyFeelingTypes
            .AsNoTracking()
            .Where(f => f.IsActive)
            .OrderBy(f => f.SortOrder)
            .Select(f => f.Name)
            .ToListAsync();

        return Ok(feelings);
    }

    [HttpPost("feeling")]
    public async Task<ActionResult> SaveFeeling([FromBody] SaveFeelingRequest request)
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var cleanFeeling = request.Feeling.Trim();

        var isValidFeeling = await _db.MoneyFeelingTypes
            .AnyAsync(f => f.Name == cleanFeeling && f.IsActive);

        if (!isValidFeeling)
        {
            return BadRequest(new { error = $"'{cleanFeeling}' is not a valid feeling option." });
        }

        var feelingSubmission = new MoneyFeelingSubmission
        {
            UserId = userId,
            Feeling = cleanFeeling,
            SubmittedAt = DateTime.UtcNow
        };

        _db.MoneyFeelingSubmissions.Add(feelingSubmission);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Feeling saved." });
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");
    }

    private static decimal GetCategoryTotal(List<MoneyEntry> entries, string categoryName)
    {
        return entries
            .Where(entry => entry.CashOutCategory?.CategoryName == categoryName)
            .Sum(entry => entry.Amount);
    }
}