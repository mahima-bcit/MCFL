using System.Security.Claims;
using MCFL.API.Data;
using MCFL.API.DTOs.RealMoney;
using MCFL.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Controllers;

[ApiController]
[Authorize]
[Route("api/real-money")]
public class RealMoneyController : ControllerBase
{
    private readonly AppDbContext _db;

    public RealMoneyController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<RealMoneySummaryResponse>> GetSummary()
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var entries = await _db.MoneyEntries
            .AsNoTracking()
            .Include(entry => entry.CashInCategory)
            .Include(entry => entry.CashOutCategory)
            .Where(entry => entry.UserId == userId)
            .OrderByDescending(entry => entry.CreatedAt)
            .ToListAsync();

        var totalCashIn = entries
            .Where(entry => entry.EntryType == "CashIn")
            .Sum(entry => entry.Amount);

        var totalCashOut = entries
            .Where(entry => entry.EntryType == "CashOut")
            .Sum(entry => entry.Amount);

        var response = new RealMoneySummaryResponse
        {
            TotalCashIn = totalCashIn,
            TotalCashOut = totalCashOut,
            Net = totalCashIn - totalCashOut,
            Entries = entries
                .Take(20)
                .Select(ToEntryResponse)
                .ToList()
        };

        return Ok(response);
    }

    [HttpGet("entries")]
    public async Task<ActionResult<List<RealMoneyEntryResponse>>> GetEntries()
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var entries = await _db.MoneyEntries
            .AsNoTracking()
            .Include(entry => entry.CashInCategory)
            .Include(entry => entry.CashOutCategory)
            .Where(entry => entry.UserId == userId)
            .OrderByDescending(entry => entry.CreatedAt)
            .ToListAsync();

        return Ok(entries.Select(ToEntryResponse).ToList());
    }

    [HttpPost("entries")]
    public async Task<ActionResult<RealMoneyEntryResponse>> CreateEntry(
        [FromBody] CreateRealMoneyEntryRequest request)
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var cleanType = request.Type.Trim();
        var cleanCategory = request.Category.Trim();

        if (cleanType != "cashIn" && cleanType != "cashOut")
        {
            return BadRequest(new { error = "Type must be cashIn or cashOut." });
        }

        var isCashIn = cleanType == "cashIn";

        CashInCategory? cashInCategory = null;
        CashOutCategory? cashOutCategory = null;

        if (isCashIn)
        {
            var databaseCashInCategoryName = NormalizeCashInCategoryName(cleanCategory);

            cashInCategory = await _db.CashInCategories
                .FirstOrDefaultAsync(category =>
                    category.CategoryName == databaseCashInCategoryName);

            if (cashInCategory is null)
            {
                return BadRequest(new
                {
                    error = $"Cash in category '{cleanCategory}' was not found."
                });
            }
        }
        else
        {
            cashOutCategory = await _db.CashOutCategories
                .FirstOrDefaultAsync(category => category.CategoryName == cleanCategory);

            if (cashOutCategory is null)
            {
                return BadRequest(new { error = $"Cash out category '{cleanCategory}' was not found." });
            }
        }

        var entry = new MoneyEntry
        {
            UserId = userId,
            EntryType = isCashIn ? "CashIn" : "CashOut",
            Amount = request.Amount,
            Comment = string.IsNullOrWhiteSpace(request.Comment)
                ? null
                : request.Comment.Trim(),
            CreatedAt = DateTime.UtcNow,
            CashInCategoryId = cashInCategory?.CashInCategoryId,
            CashOutCategoryId = cashOutCategory?.CashOutCategoryId
        };

        _db.MoneyEntries.Add(entry);
        await _db.SaveChangesAsync();

        if (cashOutCategory?.CategoryName == "Save")
        {
            var activeGoal = await _db.LearningSavingsGoals
                .Where(g => g.UserId == userId && g.IsActive)
                .OrderByDescending(g => g.CreatedAt)
                .FirstOrDefaultAsync();

            if (activeGoal != null)
            {
                activeGoal.CurrentSavedAmount = Math.Min(
                    activeGoal.TargetAmount,
                    (activeGoal.CurrentSavedAmount ?? 0) + request.Amount
                );
                activeGoal.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
        }

        var savedEntry = await _db.MoneyEntries
            .AsNoTracking()
            .Include(item => item.CashInCategory)
            .Include(item => item.CashOutCategory)
            .FirstAsync(item => item.MoneyEntryId == entry.MoneyEntryId);

        return Ok(ToEntryResponse(savedEntry));
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var cashIn = await _db.CashInCategories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => c.CategoryName)
            .ToListAsync();

        var cashOut = await _db.CashOutCategories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => c.CategoryName)
            .ToListAsync();

        return Ok(new
        {
            cashIn = cashIn.Select(DisplayCategoryName).ToList(),
            cashOut = cashOut.Select(DisplayCategoryName).ToList()
        });
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");
    }

    private static string NormalizeCashInCategoryName(string category)
    {
        // Frontend uses "Allowance / Parents". Database uses "Allowance/Parents".
        if (category == "Allowance / Parents") return "Allowance/Parents";
        return category;
    }

    private static string DisplayCategoryName(string category)
    {
        if (category == "Allowance/Parents") return "Allowance / Parents";
        return category;
    }

    private static RealMoneyEntryResponse ToEntryResponse(MoneyEntry entry)
    {
        var rawCategory = entry.EntryType == "CashIn"
            ? entry.CashInCategory?.CategoryName ?? "Unknown"
            : entry.CashOutCategory?.CategoryName ?? "Unknown";

        return new RealMoneyEntryResponse
        {
            Id = entry.MoneyEntryId,
            Type = entry.EntryType == "CashIn" ? "cashIn" : "cashOut",
            Amount = entry.Amount,
            Category = DisplayCategoryName(rawCategory),
            Comment = entry.Comment ?? string.Empty,
            CreatedAt = entry.CreatedAt
        };
    }
}