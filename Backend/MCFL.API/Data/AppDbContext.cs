using MCFL.API.Models;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MCFL.API.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Identity table + column mapping
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("AspNetUsers");

            entity.Property(e => e.Id).HasColumnName("pkUserId");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.UserName).HasColumnName("userName");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
            entity.Property(e => e.ParentConsentRequired).HasColumnName("parentConsentRequired");
            entity.Property(e => e.ParentConsentReceived).HasColumnName("parentConsentReceived");
            entity.Property(e => e.OnboardingCompleted).HasColumnName("onboardingCompleted");
            entity.Property(e => e.MustChangePassword).HasColumnName("mustChangePassword");
        });

        modelBuilder.Entity<IdentityRole>(entity =>
        {
            entity.ToTable("AspNetRoles");

            entity.Property(e => e.Id).HasColumnName("pkRoleId");
            entity.Property(e => e.Name).HasColumnName("roleName");
        });

        modelBuilder.Entity<IdentityUserRole<string>>(entity =>
        {
            entity.ToTable("AspNetUserRoles");

            entity.Property(e => e.UserId).HasColumnName("fkUserId");
            entity.Property(e => e.RoleId).HasColumnName("fkRoleId");
        });

        // One-to-one tables
        modelBuilder.Entity<UserProfile>()
            .HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<UserProfile>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ParentConsent>()
            .HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<ParentConsent>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserGameStat>()
            .HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<UserGameStat>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // One-to-many tables
        modelBuilder.Entity<SavingsGoal>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserFeedback>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MoneyFeelingSubmission>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ParentAccessLink>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ParentFeedback>()
            .HasOne(x => x.ParentAccessLink)
            .WithMany()
            .HasForeignKey(x => x.ParentAccessLinkId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ScenarioChoice>()
            .HasOne(x => x.Scenario)
            .WithMany(x => x.ScenarioChoices)
            .HasForeignKey(x => x.ScenarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ScenarioPlay>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ScenarioPlay>()
            .HasOne(x => x.Scenario)
            .WithMany()
            .HasForeignKey(x => x.ScenarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ScenarioPlay>()
            .HasOne(x => x.ScenarioChoice)
            .WithMany()
            .HasForeignKey(x => x.ScenarioChoiceId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MoneyEntry>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MoneyEntry>()
            .HasOne(x => x.CashInCategory)
            .WithMany()
            .HasForeignKey(x => x.CashInCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MoneyEntry>()
            .HasOne(x => x.CashOutCategory)
            .WithMany()
            .HasForeignKey(x => x.CashOutCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Check constraints
        modelBuilder.Entity<MoneyEntry>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_MoneyEntry_EntryType",
                "entryType IN ('CashIn', 'CashOut')"));

        modelBuilder.Entity<MoneyEntry>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_MoneyEntry_CategoryChoice",
                "(entryType = 'CashIn' AND fkCashInCategoryId IS NOT NULL AND fkCashOutCategoryId IS NULL) OR " +
                "(entryType = 'CashOut' AND fkCashOutCategoryId IS NOT NULL AND fkCashInCategoryId IS NULL)"));

        modelBuilder.Entity<ParentConsent>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_ParentConsent_ConsentGivenAt",
                "(consentGiven = 0 AND consentGivenAt IS NULL) OR (consentGiven = 1 AND consentGivenAt IS NOT NULL)"));

        modelBuilder.Entity<SavingsGoal>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_SavingsGoal_Amounts",
                "targetAmount >= 0 AND currentSavedAmount >= 0"));

        modelBuilder.Entity<ScenarioPlay>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_ScenarioPlay_GameMoney",
                "gameMoneyBefore >= 0 AND gameMoneyAfter >= 0"));

        modelBuilder.Entity<UserGameStat>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_UserGameStat_CurrentGameMoney",
                "currentGameMoney >= 0"));
    }
}