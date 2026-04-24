using System.Text;
using MCFL.API.Data;
using MCFL.API.Data.Seed;
using MCFL.API.Models.Identity;
using MCFL.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var configuration = builder.Configuration;

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register EF Core DbContext (SQLite)
var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(defaultConnection))
{
    throw new InvalidOperationException(
        "Missing connection string 'ConnectionStrings:DefaultConnection'. " +
        "Configure it in appsettings, user secrets, or environment variables.");
}
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(defaultConnection));

// Register Identity services
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Register always-run seeders
var jwtSection = configuration.GetSection("Jwt");
var jwtKey = jwtSection.GetValue<string>("Key") ?? throw new InvalidOperationException("Jwt:Key missing");
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = builder.Environment.IsProduction();
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSection["Audience"],
        ClockSkew = TimeSpan.Zero
    };
});

// Token service
builder.Services.AddScoped<ITokenService, TokenService>();

// CORS for React dev
builder.Services.AddCors(opts =>
    opts.AddPolicy("LocalDev", p => p.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

// Keep your existing seeders registrations
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
app.UseCors("LocalDev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Run always-on startup seeders in every environment; run development seeders only in Development;
// apply migrations when StartupTasks:RunMigrations is enabled.
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
