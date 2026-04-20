using Microsoft.EntityFrameworkCore;
using MCFL.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace MCFL.API.Data;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<CashInCategory> CashInCategories { get; set; } = null!;
    public DbSet<CashOutCategory> CashOutCategories { get; set; } = null!;
    public DbSet<MoneyEntry> MoneyEntries { get; set; } = null!;
    public DbSet<MoneyFeelingSubmission> MoneyFeelingSubmissions { get; set; } = null!;
    public DbSet<ParentAccessLink> ParentAccessLinks { get; set; } = null!;
    public DbSet<ParentConsent> ParentConsents { get; set; } = null!;
    public DbSet<ParentFeedback> ParentFeedbacks { get; set; } = null!;
    public DbSet<RegistrationAllowList> RegistrationAllowLists { get; set; } = null!;
    public DbSet<SavingsGoal> SavingsGoals { get; set; } = null!;
    public DbSet<Scenario> Scenarios{ get; set; } = null!;
    public DbSet<ScenarioChoice> ScenarioChoices { get; set; } = null!;
    public DbSet<ScenarioPlay> ScenarioPlays { get; set; } = null!;
    public DbSet<UserFeedback> UserFeedbacks { get; set; } = null!;
    public DbSet<UserGameStat> UserGameStats { get; set; } = null!;
    public DbSet<UserProfile> UserProfiles { get; set; } = null!;
}