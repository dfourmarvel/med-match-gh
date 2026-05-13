# MedMatch Ghana

MedMatch Ghana is a modern full-stack web platform for helping medical students, high school students interested in medicine, and dental students explore which specialty may best fit their personality, interests, work style, and lifestyle goals.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Supabase
- Groq API

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
  api/
  assessment/
  results/
  share/[id]/
  specialties/[slug]/
components/
  layout/
  quiz/
  results/
  specialties/
  ui/
lib/
  assessment.ts
  scoring.ts
  specialties.ts
  supabase.ts
  types.ts
supabase/
  schema.sql
  seed.sql
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
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Security note: keep `.env.local` private and rotate any API key that has ever been shared, committed, pasted into logs, or exposed during a demo.

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Supabase setup

1. Create a new Supabase project.
2. Run [supabase/schema.sql](/c:/Users/hp/OneDrive/Documents/med%20match%20gh/supabase/schema.sql).
3. Optionally run [supabase/seed.sql](/c:/Users/hp/OneDrive/Documents/med%20match%20gh/supabase/seed.sql).
4. Enable email or magic-link auth if you want persistent user accounts.

## Notes on Ghana-specific data

- Salary figures are approximate directional ranges in Ghana cedis and should not be interpreted as official compensation data.
- Residency pathways and opportunity notes are educational summaries meant to help users ask better follow-up questions with mentors and training programs.
- The platform explicitly references institutions such as Korle Bu Teaching Hospital, Komfo Anokye Teaching Hospital, University of Ghana Medical School, and KNUST School of Medical Sciences for local context.

## Disclaimer

This tool is designed for educational and career exploration purposes only and should not replace professional academic or career counseling.
