# AI-Powered News Aggregator - MVP Specs

## Features
- Fetch from NewsAPI, Mediastack, GDELT
- AI summarize (2–3 sentences) + 5 keywords
- Vector search + personalization
- Save articles
- Trending topics (24h)
- Dark mode, mobile-first, PWA

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind + shadcn/ui
- Supabase (DB + Auth + Vector)
- OpenAI (gpt-4o-mini + embeddings)
- Vercel deploy

## Data Flow
1. Cron → fetch → summarize → store with embedding
2. User selects interests → vector + keyword search
3. Feed = top 20 ranked articles

## Non-Functional
- < 2s feed load
- Free tier only
- TDD coverage > 80%