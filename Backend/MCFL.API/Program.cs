using System.Text;
using MCFL.API.Data;
using MCFL.API.Data.Seed;
using MCFL.API.Models.Identity;
using MCFL.API.Repositories;
using MCFL.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
var frontendOrigins = configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

if (frontendOrigins is null || frontendOrigins.Length == 0)
{
    throw new InvalidOperationException("Cors:AllowedOrigins is missing or empty.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (frontendOrigins.Length > 0)
        {
            policy
                .WithOrigins(frontendOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    });
});

// Register EF Core DbContext SQLite
var defaultConnection = configuration.GetConnectionString("DefaultConnection");

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

// JWT Authentication
var jwtSection = configuration.GetSection("Jwt");

var jwtKey = jwtSection.GetValue<string>("Key");
var jwtIssuer = jwtSection.GetValue<string>("Issuer");
var jwtAudience = jwtSection.GetValue<string>("Audience");

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("Jwt:Key is missing.");
}

if (string.IsNullOrWhiteSpace(jwtIssuer))
{
    throw new InvalidOperationException("Jwt:Issuer is missing.");
}

if (string.IsNullOrWhiteSpace(jwtAudience))
{
    throw new InvalidOperationException("Jwt:Audience is missing.");
}

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
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

// Register application services
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddOptions<BrevoOptions>()
    .Bind(configuration.GetSection("Brevo"))
    .Validate(options => !string.IsNullOrWhiteSpace(options.ApiKey), "Brevo:ApiKey is required.")
    .Validate(options => !string.IsNullOrWhiteSpace(options.SenderEmail), "Brevo:SenderEmail is required.")
    .Validate(options => !string.IsNullOrWhiteSpace(options.SenderName), "Brevo:SenderName is required.")
    .ValidateOnStart();
builder.Services.AddHttpClient<IEmailSender, BrevoEmailSender>();

// Register repositories
builder.Services.AddScoped<IAdminRepository, AdminRepository>();

// Register always-run seeders
builder.Services.AddTransient<IAlwaysSeeder, RoleSeeder>();
builder.Services.AddTransient<IAlwaysSeeder, IdentitySeeder>();
builder.Services.AddTransient<IAlwaysSeeder, LookupSeeder>();
builder.Services.AddTransient<IAlwaysSeeder, ScenarioSeeder>();

// Register development-only seeders
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentUserSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentAllowListSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentLearningTopicSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentProfileSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentMoneySeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentParentSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentUserFeedbackSeeder>();
builder.Services.AddTransient<IDevelopmentSeeder, DevelopmentScenarioPlaySeeder>();

var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Run always-on startup seeders in every environment;
// Run development seeders only in Development;
// Apply migrations when StartupTasks:RunMigrations is enabled.
var runMigrations = configuration.GetValue<bool>("StartupTasks:RunMigrations");

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
