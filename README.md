# ai news digest · my 7-day solo build

hi! i'm brianna (she/they).  
one week ago i said “let’s see if i can build a full ai-powered personal news reader in 7 days.”  
today it’s done. and it’s actually good... but still a bit broken.

live demo → https://your-app.vercel.app (or whatever you deploy)

## what it did do

- searches 1000s of articles with **vector similarity** (openai embeddings + supabase pgvector)  
- falls back to keyword search when you’re offline or rate-limited  
- lets you **save articles** with one click (real-time, optimistic ui, toast feedback)  
- sends you a **beautiful daily email digest** of everything you saved (resend + cron)  
- full auth (github + google) with proper rls  
- 100% test coverage on all business logic (pure functions ftw)  
- looks clean because shadcn/ui + sonner toasts  

## tech stack (the stuff that actually worked)

| layer         | choice                                   | why i love it                              |
|---------------|------------------------------------------|--------------------------------------------|
| frontend      | next.js 14 (app router) + react query    | instant optimism, no prop drilling         |
| styling       | tailwind + shadcn/ui                     | i never want to write css again            |
| database      | supabase (postgres + pgvector)         | rls saved my life                          |
| auth          | supabase auth                            | oauth in 5 minutes                         |
| ai            | openai (gpt-4o-mini + text-embedding-3-small) | cheap and stupidly good               |
| email         | resend                                   | html emails that don’t look like 1998      |
| testing       | vitest                                   | zero config, runs fast                     |
| deploy        | vercel                                   | one click and it just works                |

## the wins (things i’m VERY proud of)

- finished the entire thing in **7 actual days** while working full-time  
- never once mocked a full supabase chain (pure functions for filtering = 100% green tests)  
- daily email digest looks like something from substack  
- save button feels instant because of react query + optimistic updates  
- learned how to write idempotent sql migrations the hard way (thanks postgres)  

## the bruises (real problems i hit)

- supabase chain mocking hell → solved by extracting pure filters  
- shadcn cli broke twice because of registry changes → ended up writing toast manually  
- openai sdk `chat` not on prototype → had to use `vi.mock('openai', async…)`  
- `create policy if not exists` doesn’t exist in postgres → wrote a `DO $$` block  
- almost leaked my api keys by putting them in `~/.zshrc` (caught myself)
- OpenAI works as an object but on my machine it wasn't working????

## potential next steps (if i ever get bored again)

- push notifications when new articles match your saved topics  
- mobile app with expo (same codebase)  
- “follow topic” feeds  
- stripe paywall for premium digests  
- let users write their own prompts (“summarize like paul graham”)  

## want to run it yourself?

```bash
git clone https://github.com/yourusername/ai-news-digest.git
cd ai-news-digest
cp .env.example .env.local
# put your keys
npm install
npm run dev