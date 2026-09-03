# med-match-gh (MedMatch Ghana)

Next.js 15 / React 19 / TypeScript app — symptom-to-specialty matching. Tailwind CSS, Supabase (backend), Upstash Redis (rate limiting), Radix UI + Framer Motion.

## Structure
- `app/` — Next.js App Router: `assessment/`, `results/`, `share/`, `specialties/`, `api/`
- `components/` — UI components (shadcn/Radix-based, see `components.json`)
- `lib/` — shared logic/utilities
- `data/` — static/reference data
- `docs/archive/` — historical audit notes (superseded); not day-to-day reference
- `coverage/` — Jest coverage output (generated, don't edit)

## Commands
- `npm run dev` — start dev server
- `npm run build` / `npm run start` — production build/serve
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- `npm test` / `npm run test:watch` / `npm run test:coverage` — Jest + Testing Library

## Conventions
- TypeScript throughout — keep new code typed, avoid `any`.
- Uses Zod for validation — follow existing schema patterns in `lib/` or `api/` routes when adding input handling.
- Run `npm run lint` and relevant Jest tests before considering a change done.
