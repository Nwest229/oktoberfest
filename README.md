# 🍺 Oktoberfest 2026 — Crew HQ

A single-page website for the trip: **Schedule**, an interactive **Map of Munich**,
a **Contact book**, and an **anonymous Q&A**.

No build step, no framework — just open the files. Everything you'll actually
edit lives in plain, commented files.

---

## Run it locally

Because the map and Q&A load a few libraries, open it through a tiny local
server rather than double-clicking `index.html`:

```bash
cd "Personal Projects/Oktoberfest"
python3 -m http.server 8000
```

Then visit **http://localhost:8000**.

---

## What to edit (no coding needed)

| You want to change… | Edit this file |
| --- | --- |
| The day-by-day plan / arrival times | `data/schedule.js` |
| Map pins (tents, hotel, meeting points) | `data/spots.js` |
| People and phone numbers | `data/contacts.js` |
| Turn on the shared Q&A | `config.js` |

Each file has instructions at the top. A few tips:

- **Map coordinates:** open [Google Maps](https://maps.google.com), right-click the
  exact spot, and click the `lat, lng` numbers to copy them. Paste into `data/spots.js`.
- **Phone numbers:** use international format like `+49 151 2345678` so the
  Call/Text buttons work from any phone.

---

## Anonymous Q&A — two modes

**Preview mode (default):** works instantly, but questions are stored only in
your own browser. Fine for testing; your friends won't see each other's posts.

**Shared mode (recommended for the trip):** everyone sees the same board, still
anonymously. Set it up once with a free Supabase project:

1. Go to **https://supabase.com** → sign up → **New project** (free tier is plenty).
2. In the project, open **SQL Editor** and run this to create the tables:

   ```sql
   create table questions (
     id uuid primary key default gen_random_uuid(),
     text text not null,
     created_at timestamptz default now()
   );

   create table answers (
     id uuid primary key default gen_random_uuid(),
     question_id uuid references questions(id) on delete cascade,
     text text not null,
     created_at timestamptz default now()
   );

   -- Allow the site to read & post anonymously
   alter table questions enable row level security;
   alter table answers   enable row level security;

   create policy "anon read questions"  on questions for select using (true);
   create policy "anon write questions" on questions for insert with check (true);
   create policy "anon read answers"    on answers   for select using (true);
   create policy "anon write answers"   on answers   for insert with check (true);
   ```

3. Open **Project Settings → API** and copy:
   - **Project URL** → paste into `SUPABASE_URL` in `config.js`
   - **anon public** key → paste into `SUPABASE_ANON_KEY` in `config.js`
4. Reload the site. The yellow "preview mode" banner disappears — you're live and shared.

> The **anon public** key is safe to ship in a public site; the row-level
> security policies above only allow reading and posting to these two tables.
> It's a Q&A board, so anyone with the link can post — that's the point.

---

## Put it online with GitHub Pages

Having other repos on your account is fine — this is just one more. Steps:

1. Create a new repo on GitHub (e.g. `oktoberfest`). Public is simplest;
   private also works with Pages.
2. Push this folder to it:

   ```bash
   cd "Personal Projects/Oktoberfest"
   git init
   git add .
   git commit -m "Oktoberfest crew site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/oktoberfest.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, pick **main** branch and **/ (root)**, then **Save**.
4. Wait ~1 minute. Your site is live at
   `https://<your-username>.github.io/oktoberfest/`. Share that link with the crew.

Every time you edit a file, `git add . && git commit -m "update" && git push`
and Pages redeploys automatically.

> Other static hosts also work (Netlify / Vercel / Cloudflare Pages): no build
> command, output directory = root.

Prost! 🍻

---

## Files

```
index.html          the page
config.js           Q&A backend keys (optional)
css/styles.css      styling
data/schedule.js    ← edit: the plan
data/spots.js       ← edit: map pins
data/contacts.js    ← edit: people + numbers
js/app.js           tabs, schedule + contacts
js/map.js           Leaflet map
js/qa.js            anonymous Q&A logic
```
