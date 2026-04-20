# Soulcially-Speaking

This repository contains the backend API for the Soulcially-Speaking industry project (BCIT SSD). This README describes the minimal dependencies and steps required for teammates to clone the repo, install required frameworks/tools, set up the local SQLite database and run the project.

## Prerequisites

- Git (any recent version)
- .NET 8 SDK (install from https://dotnet.microsoft.com/download)
- Visual Studio 2022 (recommended) with the **ASP.NET and web development** workload OR VS Code with the C# extension
- (Optional) SQLite viewer / browser (DB Browser for SQLite) to inspect the `.db` file
- dotnet-ef CLI tool (used for EF Core migrations)

## Verify .NET Installation

Open a terminal and run:
```bash
dotnet --version
```

## Clone repository

```bash
git clone https://github.com/mahima-bcit/Soulcially-Speaking.git
cd Soulcially-Speaking
```

Run all commands from the repository root unless specified

## Install global tools

Install or update the EF Core CLI tool (required for migrations):

```bash
dotnet tool install --global dotnet-ef
```

or if already installed:

```bash
dotnet tool update --global dotnet-ef
```

Ensure the tool path is in your PATH (restart terminal if necessary).

## Restore and build

Restore NuGet packages and build the solution:

```bash
dotnet restore
```
```bash
dotnet build
```

## Project-specific packages

The API project is `MCFL.API`. Add the EF Core SQLite provider and design packages if they are not already in the project:

```bash
dotnet add MCFL.API package Microsoft.EntityFrameworkCore.Sqlite
```
```bash
dotnet add MCFL.API package Microsoft.EntityFrameworkCore.Design
```

(You can skip these if the packages are already listed in `MCFL.API.csproj`.)

## App configuration

Create or update `MCFL.API/appsettings.json` with a connection string for SQLite. Example minimal file:

```json
{ "ConnectionStrings": { "DefaultConnection": "Data Source=mcfl.db" } }
```

This will create local SQLite database file `mcfl.db` when migrations applied in the project directory.

## Verify Database & Identity Configuration

Ensure that AppDbContext and Identity are correctly configured in:

MCFL.API/Program.cs

Confirm DbContext registration:


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

Confirm Identity setup:


builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();



## Apply Database migrations

```bash
dotnet ef database update --project MCFL.API --startup-project MCFL.API
```


Notes:

- The project uses ASP.NET Core Identity. The initial migration should include all Identity tables needed

## Run the API

- CLI: 
```bash
dotnet run --project MCFL.API
```

Once running, open:
https://localhost:<port>/swagger

## Common troubleshooting

- "No migrations were found / Could not find DbContext": ensure `--project` points to the project containing `AppDbContext`, and `--startup-project` points to the web project (the one that contains `Program.cs`).
- If `dotnet-ef` command not found: verify the global tool is installed and your PATH is updated, then restart the terminal.
- If the DB file doesn't appear: check your connection string path and current working directory; `Data Source=mcfl.db` creates the DB in the project's working directory.

## Tips for contributors

- Keep migrations small and focused.
- If you add new models, create a new migration and share it (committed) with the team.
- If you need to reset locally: delete the `mcfl.db` file, delete the `Migrations` folder (if needed), recreate migrations and run `Update-Database`.

