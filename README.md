# MedMatch Ghana

MedMatch Ghana is a modern full-stack web platform for helping medical students, high school students interested in medicine, and dental students explore which specialty may best fit their personality, interests, work style, and lifestyle goals.

> 🚀 **Deploying / going live?** Follow **[PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)** — a detailed, step-by-step guide to set the Vercel environment variables (Supabase, OpenRouter, Upstash, site URL) and get the site indexed on Google.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Supabase
- OpenRouter API

## Features included

- Premium landing page
- 25-question specialty assessment
- Weighted trait scoring engine in TypeScript
- Top 5 specialty matches
- AI-generated personalized explanation
- Radar chart and bar chart visualizations
- Top 3 specialty comparison table
- Ghana-aware specialty detail pages
- Dark mode
- Guest mode via local storage
- Supabase-ready saved result and share-link scaffolding
- Export-to-PDF via browser print flow
- Searchable specialty explorer

## Project structure

```text
app/
  api/           # score, save-result, quiz-results, results/[id], ai-explanation, health
  assessment/
  results/
  share/[id]/
  specialties/[slug]/
  pathways/      # cited Ghana training context
  layout.tsx
  page.tsx
components/
  ghana/         # the GCPS citation block
  home/
  layout/
  motion/
  quiz/
  results/
  specialties/
  ui/
  theme-provider.tsx
lib/
  ai/            # OpenRouter call + prompt construction
  assessment.ts  # the 25 questions and 15 trait labels
  ghana.ts       # GCPS references, institutions, regions
  scoring.ts     # the live scoring engine
  specialties.ts # the live catalogue: 20 specialties
  supabase.ts
  types.ts
supabase/
  schema.sql
  migrations/
docs/archive/ # historical audit notes (superseded)
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Security note: keep `.env.local` private and rotate any API key that has ever been shared, committed, pasted into logs, or exposed during a demo.

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Testing

Run the suite with:

```bash
npm test
```

Jest uses the `jsdom` environment by default (so React component tests work).
**API route tests must opt into the Node environment** with a docblock at the
top of the file, because route handlers use the Web `Request`/`Response` APIs:

```ts
/**
 * @jest-environment node
 */
```

See `app/api/ai-explanation/__tests__/route.test.ts` for an example. Without
this docblock, route tests run under jsdom and fail in confusing ways.

## Supabase setup

1. Create a new Supabase project.
2. Run [supabase/schema.sql](supabase/schema.sql).
3. Run the RLS migrations in `supabase/migrations/` (in filename order).

That is the whole setup. There is one table, `quiz_results`, and no auth — the
app is deliberately account-free, and results are reached by unguessable share
link rather than by login.

## Notes on Ghana-specific data

- Salary figures are approximate directional ranges in Ghana cedis and should not be interpreted as official compensation data.
- Residency pathways and opportunity notes are educational summaries meant to help users ask better follow-up questions with mentors and training programs.
- Training context is cited rather than asserted: [/pathways](https://medmatchgh.vercel.app/pathways) lists the recognised training environments (Korle-Bu, Komfo Anokye, Tamale, Cape Coast and Ho teaching hospitals, University of Ghana Medical School, KNUST School of Medical Sciences and others) and links to the official Ghana College of Physicians and Surgeons pages. Specialty pages link to it rather than claiming which hospital trains which discipline — the source data carries no such mapping.

## Disclaimer

This tool is designed for educational and career exploration purposes only and should not replace professional academic or career counseling.

## License

Released under the [MIT License](LICENSE).
