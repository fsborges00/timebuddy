# ET Time Buddy

ET Time Buddy is a GitHub Pages–ready static web app for planning times across multiple time zones with **Eastern Time (America/New_York)** as a built-in anchor.

It shows:
- ET current time
- Multiple selected timezone times
- Time difference versus ET (ahead/behind)

It also supports:
- **Now** mode (auto-updates every second)
- **Pick date/time** mode with selectable input timezone
- Add by timezone code (for example `IST`, `CST`), city, country, or IANA zone (`Europe/London`)
- Favorites with local persistence (`localStorage`)
- Chronological ordering in the Results panel by local date/time
- Copy buttons for:
  - Full time list
  - Email-subject format grouped by day (uses `///` between day groups)

## Email Subject Format (Pick Mode)

In **Pick date/time** mode, copied email subjects are grouped by local calendar day and sorted by time within each day.

Example:

`February 25th @ 10:37PM CST // 11:37PM EST /// February 26th @ 5:37AM CET // 10:07AM IST // 1:37PM JST`

This makes cross-day differences explicit (for example, when India or Japan is already on the next day).

## Why Luxon?
The app uses the lightweight [Luxon](https://moment.github.io/luxon/#/) library (via CDN) to make timezone/date conversion reliable for arbitrary dates, including daylight saving transitions in both ET and remote zones.

## Project structure

```
index.html
app.js
styles.css
README.md
```

## Run locally

### Option 1: Open directly
Double-click `index.html` (or open it in your browser).

### Option 2: Use a tiny local server
From the project folder:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

## Quick usage notes

- The location field starts empty by design.
- In **Pick date/time** mode, use **Copy email subject** for grouped day-aware output.
- In **Now** mode, use **Copy all times** for a line-by-line snapshot.

## Deploy on GitHub Pages

1. Push this repo to GitHub (branch: `main`).
2. In GitHub, open your repository.
3. Go to **Settings** → **Pages**.
4. Under **Build and deployment**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Save.
6. Wait for Pages to deploy, then open the generated URL shown on the Pages settings screen.

## Optional: Add a custom domain

1. Buy/configure your domain with your DNS provider.
2. In GitHub repo: **Settings** → **Pages** → **Custom domain**.
3. Enter your domain and save.
4. Add DNS records at your provider:
   - `CNAME` for subdomain (e.g., `www`) to `<your-github-username>.github.io`
   - `A`/`ALIAS` records as recommended by GitHub Pages for apex domains
5. Enable **Enforce HTTPS** after DNS is validated.

For full DNS details, follow GitHub Pages docs:
- https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
