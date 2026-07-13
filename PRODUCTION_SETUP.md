# MedMatch Ghana — Production Setup & Go-Live Guide

> A step-by-step, click-by-click guide to finish taking MedMatch Ghana live:
> environment variables (Supabase, Groq, Upstash, site URL) and SEO (getting on Google).
> Written to be followed top-to-bottom by someone who has **not** done this before.

## Where things stand today

- ✅ The app is **live on Vercel** (`dfourmarvels-projects/med-match-gh`) and every push to `main` auto-deploys. All recent builds are green.
- ⚠️ **No environment variables are set in Vercel yet.** Until you add them, on the live site:
  - **Save / share / "my results"** don't persist (no Supabase → guest/local mode only).
  - **AI explanations** show generic fallback text (no Groq key).
  - **Rate limiting** is in-memory only (fine, but not durable on serverless — no Upstash).
  - **SEO URLs are broken** — the sitemap and page links say `http://localhost:3000` instead of your real domain (no `NEXT_PUBLIC_SITE_URL`). **Google cannot use localhost URLs**, so this must be fixed before SEO can work.

Do **Part 1** first — SEO in Part 2 depends on it.

---

# Part 1 — Environment variables (do this first)

An "environment variable" is a secret setting (a key/value) you store in Vercel instead of in the code. The app reads them at runtime. They are **not** in the code and must be added by hand in the Vercel dashboard.

## 1.0 How to add an environment variable in Vercel (the mechanic — you'll repeat this)

1. Go to **vercel.com** → sign in → open the **med-match-gh** project.
2. Top menu: **Settings** → left sidebar: **Environment Variables**.
3. Under **Key** type the variable name (e.g. `NEXT_PUBLIC_SITE_URL`), under **Value** paste its value.
4. **Environments**: tick **Production**, **Preview**, and **Development** (all three).
5. Click **Save**.
6. Repeat for each variable below.
7. **Important:** env vars only take effect on a **new build**. After adding them, go to **Deployments** → the latest one → **⋯** menu → **Redeploy** (leave "use existing build cache" unticked). Or just push any commit to `main`.

> Reference: the file [`.env.example`](.env.example) in the repo lists every variable the app understands, with comments.

## 1.1 `NEXT_PUBLIC_SITE_URL` — REQUIRED (fixes SEO + share links)

This is the single most important one for SEO.

1. Find your production domain: Vercel → **med-match-gh** → **Settings** → **Domains** (or the **Domains** tab). Use the primary `https://…` domain (e.g. `https://med-match-gh-xxxx.vercel.app`, or your custom domain if you added one).
2. Add the variable:
   - **Key:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://<your-production-domain>` (no trailing slash)
3. **Redeploy** (step 1.0 #7).
4. Verify: open `https://<your-production-domain>/sitemap.xml` — the URLs inside should now show your real domain, **not** `localhost`.

## 1.2 Supabase — saving results, share links, and "my results"

Supabase is the database. Without it, results aren't saved and share links don't work.

**A. Create the project**
1. Go to **supabase.com** → sign in → **New project**. Pick a name, a strong DB password, and a region (choose one close to your users, e.g. West Europe).

**B. Create the tables (run the SQL that's already in this repo)**
2. In Supabase: left sidebar → **SQL Editor** → **New query**.
3. Run these files **in this exact order** — open each file in the repo, copy its entire contents into the SQL editor, and click **Run**:
   1. [`supabase/schema.sql`](supabase/schema.sql) — creates the `quiz_results` table + the `get_quiz_result` function (share links).
   2. [`supabase/medmatch_dataset_schema.sql`](supabase/medmatch_dataset_schema.sql) — creates the fuller dataset tables (`users`, `quiz_attempts`, `quiz_answers`, `trait_scores`, `specialties`, …) used by `/results?userId=`.
   3. [`supabase/seed.sql`](supabase/seed.sql) — fills in the specialties reference data.
   4. [`supabase/migrations/20260521_enable_rls_quiz_results.sql`](supabase/migrations/20260521_enable_rls_quiz_results.sql) — applies the **anonymous-first** security policies (anyone can save a result; results are readable by their unguessable link ID). Safe to re-run.

**C. Get the three keys**
4. Supabase → **Project Settings** (gear icon) → **API**.
5. Copy these three values:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **`anon` `public` key** → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **`service_role` `secret` key** → this is `SUPABASE_SERVICE_ROLE_KEY` ← **keep this secret; never put it in the browser/code**

**D. Add them to Vercel** (using step 1.0)
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service_role key
6. **Redeploy.**
7. Test: on the live site, complete the assessment → **See Results** → **Save** → open the share link it gives you. It should load the saved report.

## 1.3 Groq — AI-written explanations

Without this, the "Personalized AI guidance" section shows a sensible fallback paragraph (the app still works).

1. Go to **console.groq.com** → sign in → **API Keys** → **Create API Key** → copy it.
2. Add to Vercel:
   - `GROQ_API_KEY` = the key you copied
   - `GROQ_MODEL` = `llama-3.1-8b-instant`  *(this exact value is a good default)*
3. **Redeploy.**

## 1.4 Upstash — durable rate limiting (optional but recommended for production)

Without this, the rate limiter still works but resets per serverless instance (so limits are looser in production). See the earlier discussion — this is the "real" production fix.

1. Go to **console.upstash.com** → sign in → **Create Database** → type **Redis** → pick a region near your Vercel region → **Create**.
2. On the database page, scroll to the **REST API** section → copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Add both to Vercel → **Redeploy**.

## Environment variable summary

| Variable | Required? | Where to get it | Sent to browser? |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes (SEO) | Your Vercel production domain | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ For save/share | Supabase → Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ For save/share | Supabase → Settings → API | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ For save/share | Supabase → Settings → API | **No — secret** |
| `GROQ_API_KEY` | ⬜ Optional | console.groq.com → API Keys | **No — secret** |
| `GROQ_MODEL` | ⬜ Optional | Use `llama-3.1-8b-instant` | **No** |
| `UPSTASH_REDIS_REST_URL` | ⬜ Recommended | console.upstash.com → Redis → REST | **No — secret** |
| `UPSTASH_REDIS_REST_TOKEN` | ⬜ Recommended | console.upstash.com → Redis → REST | **No — secret** |

> After adding secrets, **never** paste `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, or the Upstash token into the code, a public chat, or the browser. They belong only in Vercel's Environment Variables screen.

---

# Part 2 — SEO: getting on Google (4 steps)

**Reality check first.** These steps make Google *able and likely* to list your site — they do **not** rank you #1 or make you appear instantly. After you do this, Google takes **days to a few weeks** to crawl and index. Your **brand name ("MedMatch Ghana")** will surface first because little else competes for it; generic phrases take longer and depend on content and other sites linking to you.

## Step 1 — Set the site URL and confirm the sitemap is correct

*(This is Part 1.1 — do it if you haven't.)*
1. Ensure `NEXT_PUBLIC_SITE_URL` is set in Vercel and you've **redeployed**.
2. Also confirm the live site is **publicly reachable**: open your production domain in a **private/incognito** browser window. If it asks you to log in to Vercel, go to Vercel → **Settings** → **Deployment Protection** and make sure the **production** domain is public (otherwise Google can't crawl it).
3. Verify these two URLs load and show your **real domain**:
   - `https://<your-domain>/sitemap.xml`
   - `https://<your-domain>/robots.txt`

## Step 2 — Add your site to Google Search Console (and verify ownership)

Google Search Console (free) is how you tell Google "this site is mine, please index it."

1. Go to **search.google.com/search-console**.
2. Click **Add property** → choose **URL prefix** → enter `https://<your-domain>` → **Continue**.
3. Verify ownership. You have two easy options:
   - **HTML file (already partly set up):** this repo already serves a Google verification file at `/google011fbbadaefd4897.html`. If that verification code matches the one Search Console offers you, choose the **HTML file** method and click **Verify**. *(If Search Console gives a different file name, tell me and I'll add it to the repo.)*
   - **HTML tag:** Search Console gives you a `<meta name="google-site-verification" content="…">` tag. Send me that content string and I'll add it to the site's metadata, then you redeploy and click **Verify**.

## Step 3 — Submit your sitemap

1. In Search Console (with your property selected): left sidebar → **Sitemaps**.
2. Under **Add a new sitemap**, type `sitemap.xml` → **Submit**.
3. It should show **Success** and, after a while, the number of discovered pages (~23).

## Step 4 — Request indexing, then check

1. In Search Console, top **URL inspection** bar → paste your homepage `https://<your-domain>/` → Enter → click **Request indexing**. Repeat for `/specialties` and one or two specialty pages.
2. Wait — indexing takes **days to weeks**. Then check progress:
   - In Google, search **`site:<your-domain>`** (e.g. `site:med-match-gh.vercel.app`). This shows exactly which of your pages Google has indexed.
   - Search **`MedMatch Ghana`** — once indexed, your site should appear for this brand term.

### What to search for (and realistic expectations)

| Search term | Type | Expectation |
|---|---|---|
| `MedMatch Ghana` | Your brand | Should appear within days of indexing — low competition |
| `site:<your-domain>` | Diagnostic | Shows which pages Google has indexed (not a public ranking) |
| `medical specialty quiz` | Generic/topic | Competitive — takes time, content, and backlinks |
| `which medical specialty fits me` | Generic/topic | Competitive — long-term effort |
| `choosing a medical specialty Ghana` | Niche/topic | Best realistic organic target — less competition, on-topic |
| `dental specialty Ghana` | Niche/topic | Reasonable target over time |

> To improve rankings over time (beyond this setup): keep the specialty content rich and accurate, get other sites/socials to link to you, and consider a proper custom domain (looks more credible than a `*.vercel.app` URL).

---

# Part 3 — Final go-live checklist

Environment (Part 1):
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel + redeployed
- [ ] Supabase project created; all 4 SQL files run in order
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `GROQ_API_KEY` (+ `GROQ_MODEL`) set (optional)
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` set (recommended)
- [ ] Redeployed after adding everything
- [ ] Live test: assessment → See Results → Save → open share link works

SEO (Part 2):
- [ ] `/sitemap.xml` and `/robots.txt` show the real domain (not localhost)
- [ ] Site loads publicly in an incognito window (no Vercel login wall)
- [ ] Search Console property added and **verified**
- [ ] Sitemap submitted (shows Success)
- [ ] Homepage + key pages submitted via URL inspection → Request indexing
- [ ] Days later: `site:<your-domain>` and `MedMatch Ghana` return results

---

*Questions or stuck on a step? The exact values (domain, Search Console tag, keys) can be wired in for you — just share what the dashboard shows you.*
