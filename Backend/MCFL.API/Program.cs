using MCFL.API.Data;
using MCFL.API.Data.Seed;
using MCFL.API.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register EF Core DbContext (SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Identity services
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Register always-run seeders
builder.Services.AddTransient<IAlwaysSeeder, RoleSeeder>();
builder.Services.AddTransient<IAlwaysSeeder, IdentitySeeder>();
builder.Services.AddTransient<IAlwaysSeeder, LookupSeeder>();
builder.Services.AddTransient<IAlwaysSeeder, ScenarioSeeder>();

// Register future dev-only seeders here later
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentUserSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentAllowListSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentProfileSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentMoneySeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentParentSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentUserFeedbackSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentScenarioPlaySeeder>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Run startup seeders in every environment; apply migrations only in Development
var runMigrations = builder.Configuration.GetValue<bool>("StartupTasks:RunMigrations");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    var logger = services.GetRequiredService<ILogger<Program>>();

    if (runMigrations)
    {
        try
        {
            await db.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to apply database migrations at startup.");
            throw;
        }
    }

    var alwaysSeeders = services.GetServices<IAlwaysSeeder>();
    foreach (var seeder in alwaysSeeders)
    {
        await seeder.SeedAsync();
    }

    if (app.Environment.IsDevelopment())
    {
        var devSeeders = services.GetServices<IDevelopmentSeeder>();
        foreach (var seeder in devSeeders)
        {
            await seeder.SeedAsync();
        }
    }
}

app.Run();
