# MCFL – Money Confidence For Life

MCFL is a full-stack web application that teaches financial literacy through interactive game scenarios. It has a **React + TypeScript frontend** and an **ASP.NET Core 8 backend** with a SQLite database.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Full Application](#running-the-full-application)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Install these tools before you begin. Click the links for download pages.

| Tool | Why you need it |
|------|----------------|
| [Git](https://git-scm.com/downloads) | Clone the repository |
| [Node.js LTS](https://nodejs.org/) | Run the frontend (npm is included) |
| [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) | Run the backend API |

**After installing, verify everything works by opening a terminal and running:**

```bash
git --version
node --version
npm --version
dotnet --version
```

Each command should print a version number. If any command is not found, restart your terminal and try again.

**Optional but helpful:**
- [VS Code](https://code.visualstudio.com/) with the **C# Dev Kit** extension (for backend)
- [DB Browser for SQLite](https://sqlitebrowser.org/) (to inspect the database visually)

---

## Clone the Repository

```bash
git clone <repo-url>
cd MCFL
```

> Run all commands from the **repository root** (`MCFL/`) unless a step says otherwise.

---

## Backend Setup

The backend is an ASP.NET Core 8 API. Follow these steps in order.

### Step 1 — Install the EF Core CLI tool

This tool is needed to set up the database. Run this once on your machine:

```bash
dotnet tool install --global dotnet-ef
```

If you get a message saying it's already installed, update it instead:

```bash
dotnet tool update --global dotnet-ef
```

> If the `dotnet-ef` command isn't found after installing, close and reopen your terminal.

---

### Step 2 — Restore packages

Download all backend dependencies:

```bash
dotnet restore
```

---

### Step 3 — Create your secrets file

The backend needs a configuration file with secrets (database path, JWT key, etc.). This file is **not committed to git** because it contains sensitive values — each developer creates their own copy.

A template is provided at `Backend/MCFL.API/secrets.example.json`.

**Create your secrets file by copying the template:**

```bash
# Mac/Linux
cp Backend/MCFL.API/secrets.example.json Backend/MCFL.API/appsettings.Development.json

# Windows (PowerShell)
Copy-Item Backend/MCFL.API/secrets.example.json Backend/MCFL.API/appsettings.Development.json
```

**Then open `Backend/MCFL.API/appsettings.Development.json` and fill in the values:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=mcfl.db"
  },
  "SeedAdmin": {
    "Email": "admin@example.com",
    "Password": "Admin@123!"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173"
    ]
  },
  "Jwt": {
    "Key": "your-super-secret-key-must-be-at-least-32-characters",
    "Issuer": "mcfl",
    "Audience": "mcfl",
    "ExpireMinutes": "60"
  },
  "Brevo": {
    "ApiKey": "your-brevo-api-key",
    "SenderEmail": "your-sender@email.com",
    "SenderName": "MCFL"
  },
  "Frontend": {
    "ConsentConfirmUrl": "http://localhost:5173/consent-confirm"
  }
}
```

**What each value means:**

| Key | What to put here |
|-----|-----------------|
| `ConnectionStrings.DefaultConnection` | Keep as `Data Source=mcfl.db` — this creates a local SQLite file |
| `SeedAdmin.Email` / `Password` | Your admin login credentials for the app |
| `Cors.AllowedOrigins` | Keep as `http://localhost:5173` — the frontend dev server address |
| `Jwt.Key` | Any random string, **must be at least 32 characters** |
| `Jwt.Issuer` / `Audience` | Can be any string (e.g. `mcfl`) — they just need to match |
| `Jwt.ExpireMinutes` | How long login sessions last (e.g. `60`) |
| `Brevo.*` | Email service credentials — only needed if testing parent consent emails |
| `Frontend.ConsentConfirmUrl` | Keep as shown — used in consent email links |

---

### Step 4 — Set up the database

This creates the local database file and populates it with seed data:

```bash
dotnet ef database update --project Backend/MCFL.API --startup-project Backend/MCFL.API
```

You only need to run this once. If it succeeds, a file called `mcfl.db` will appear in `Backend/MCFL.API/`.

---

### Step 5 — Run the backend

```bash
dotnet run --project Backend/MCFL.API
```

The terminal will print the URLs the API is running on, for example:

```
Now listening on: https://localhost:7211
Now listening on: http://localhost:5096
```

> **Note your HTTPS port** (e.g. `7211`) — you will need it for the frontend setup.  
> The default ports are defined in `Backend/MCFL.API/Properties/launchSettings.json` and can be changed there if needed.

Once running, open `https://localhost:<your-https-port>/swagger` in your browser to confirm the API is working. You should see the Swagger UI.

---

## Frontend Setup

The frontend is a React + TypeScript app built with Vite.

### Step 1 — Install dependencies

```bash
cd Frontend
npm install
```

---

### Step 2 — Configure the environment file

The frontend uses a `.env.development` file to know where the backend API is. This file is already included in the repository at `Frontend/.env.development`.

Open it and make sure the port matches your backend's HTTPS port from Step 5 above:

```env
VITE_API_BASE_URL=https://localhost:<your-https-port>/api
```

For example, if your backend is running on port `7211`:

```env
VITE_API_BASE_URL=https://localhost:7211/api
```

---

### Step 3 — Run the frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Running the Full Application

Both the backend and frontend must run **at the same time**. Open **two separate terminals**:

**Terminal 1 — Start the backend (from repo root):**
```bash
dotnet run --project Backend/MCFL.API
```

**Terminal 2 — Start the frontend:**
```bash
cd Frontend
npm run dev
```

Then open **`http://localhost:5173`** in your browser.

Log in using the `SeedAdmin` email and password you set in `appsettings.Development.json`.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `dotnet-ef` command not found | Close and reopen your terminal. On Mac/Linux, ensure `~/.dotnet/tools` is in your PATH |
| API won't start — JWT error | Check that `Jwt.Key` in `appsettings.Development.json` is at least 32 characters |
| API won't start — connection string error | Make sure `appsettings.Development.json` exists in `Backend/MCFL.API/` |
| Browser shows CORS error | Confirm `Cors.AllowedOrigins` contains `http://localhost:5173` |
| `mcfl.db` file not created | Re-run `dotnet ef database update ...` and check for error messages |
| Frontend shows network errors | Make sure both servers are running and the port in `Frontend/.env.development` matches your backend's HTTPS port |
| Login doesn't work | Double-check your `SeedAdmin` credentials in `appsettings.Development.json` match what you're typing |
| Port already in use | Change the port in `Backend/MCFL.API/Properties/launchSettings.json`, then update `Frontend/.env.development` to match |
