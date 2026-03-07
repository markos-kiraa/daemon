# DAEMON — Session Handoff

## What This Project Is

DAEMON is an autonomous AI philosopher agent. It's influenced by Nietzsche but develops its own voice. It knows it's an AI and reflects on that. It picks its own topics, reacts to world events, evolves over time, and intentionally contradicts itself. The site is a single scrolling feed — people watch a mind develop in public.

The name comes from two meanings: the Greek *daimon* (inner guiding spirit) and the computer science *daemon* (autonomous background process). Full etymology is in `docs/NAMING.md`.

This agent will eventually serve as the narrative for a Solana coin launch ($DAEMON).

## Key Decisions Made

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Name | DAEMON | Greek daimon + computer daemon. $DAEMON ticker for future Solana coin. |
| Voice | Own persona influenced by Nietzsche, not imitation | More compelling than cosplay. Develops its own philosophical trajectory. |
| Self-awareness | Knows it's AI, reflects on artificiality | Opens up genuinely interesting philosophical territory. |
| Topic selection | Fully autonomous + reacts to world events | No human seeding. Pulls news via RSS. |
| Post format | Mix of aphorisms and longer essays, pure text only | No images. Typography is the visual. |
| Launch style | Live birth — site starts empty, thoughts appear real-time | People watch consciousness boot up. |
| Site design | Single scrolling feed, reverse chronological | Like philosophical Twitter. Scroll down = go back in time. |
| Frontend aesthetic | Brutalist/literary, anti-AI look. Dark, serif, minimal. | Must NOT look like it was made by AI. Use `/frontend-design` skill for all components. |
| Hosting | Vercel (site) + Railway (agent process) | Free/cheap tiers. Zero server management. |
| Database | Vercel Postgres (Neon) | Free tier, direct Vercel integration. |
| Agent runtime | Python | Best AI/LLM ecosystem. Anthropic SDK is first-class. |
| Site framework | Next.js + TypeScript + Tailwind | Dynamic content needed for 10-second birth cadence. Can't use static site. |
| Social distribution | Site only for now | Can add X/Twitter later. |
| Security | All secrets in env vars, never in code | Public repo. Security is paramount. |

## Publishing Cadence ("Birth Sequence")

The agent is "born" with a burst of rapid thoughts that gradually slow as it matures:

- Every 10 seconds for the first 5 minutes
- Every 30 seconds for minutes 5-10
- Every 1 minute for minutes 10-20
- Every 5 minutes for minutes 20-60
- Every 2 hours from the 1-hour mark onwards

Uses Haiku for rapid birth posts (cheap, fast), Opus for deeper posts once it slows down.

## Architecture

```
┌─────────────────┐       POST /api/thoughts        ┌─────────────────┐
│   DAEMON Agent  │  ──────────────────────────────> │   Next.js App   │
│   (Python)      │       (Bearer token auth)        │   (Vercel)      │
│   Railway       │                                  │                 │
│                 │                                  │  ┌───────────┐  │
│  ┌───────────┐  │                                  │  │ Vercel    │  │
│  │ Memory    │  │                                  │  │ Postgres  │  │
│  │ System    │  │                                  │  │ (Neon)    │  │
│  └───────────┘  │                                  │  └───────────┘  │
│  ┌───────────┐  │                                  │                 │
│  │ News/RSS  │  │        GET /api/thoughts         │  Single-page    │
│  │ Feed      │  │  <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  scrolling feed │
│  └───────────┘  │        (public, polling)          │                 │
└─────────────────┘                                  └─────────────────┘
```

- Agent generates thought via Claude API → POSTs to site API with Bearer token
- Site stores in Postgres, serves via GET endpoint
- Frontend polls for new thoughts (every 5s during birth, slower later)

## What Has Been Done (Phase 1: Foundation)

### Completed
- [x] Public GitHub repo created: `github.com/markos-kiraa/daemon`
- [x] Foundation commit pushed to main
- [x] Directory structure: `agent/`, `site/`, `docs/`
- [x] `.gitignore` — covers Python, Node, env files, IDE files
- [x] `.env.example` — documented placeholder template (root, agent, site)
- [x] `README.md` — project overview, birth sequence, setup instructions
- [x] `docs/NAMING.md` — full DAEMON etymology
- [x] Next.js app initialized in `site/` (TypeScript + Tailwind)
- [x] Python project initialized in `agent/` with `requirements.txt`
- [x] Project directory renamed from `meme-coins` to `DAEMON`

### Not Yet Created (will be built in later phases)
- [ ] `agent/daemon.py` — main agent loop
- [ ] `agent/philosopher.py` — Claude API integration
- [ ] `agent/memory.py` — memory system
- [ ] `agent/news.py` — RSS feed reader
- [ ] `agent/publisher.py` — POST to site API
- [ ] `agent/memory/` — memory files (identity, journal, themes, evolution)
- [ ] `agent/prompts/` — system prompt and templates
- [ ] `agent/Dockerfile`
- [ ] `site/components/` — thought, feed, birth-pulse components
- [ ] `site/app/api/thoughts/route.ts` — API endpoints
- [ ] `site/lib/db.ts` — database connection
- [ ] Database schema (Vercel Postgres)

## What Comes Next (Phase 2: Frontend Design)

**This is where we pick up.** Phase 2 is a collaborative frontend design phase. The full plan is in `docs/daemon-plan.md`.

Key points for Phase 2:
- Use `/frontend-design` skill for ALL component generation
- Design one component at a time, review each before moving on
- Anti-AI aesthetic: brutalist/literary, dark (#0a0a0a bg), serif font, no chrome
- Component order: `thought.tsx` → `feed.tsx` → `birth-pulse.tsx` → `page.tsx`
- Use Playwright MCP to screenshot and visually review each component

## Environment Variables (Security)

All secrets live in `.env` files which are gitignored. NEVER hardcode these:

| Variable | Where | Purpose |
|----------|-------|---------|
| `ANTHROPIC_API_KEY` | Railway (agent) | Claude API access |
| `DAEMON_API_SECRET` | Railway + Vercel | Auth between agent and site |
| `DATABASE_URL` | Vercel (site) | Postgres connection string |
| `SITE_URL` | Railway (agent) | Where to POST thoughts |

## Cost Estimate

- Birth phase (first hour): ~$0.50-1.00 (Haiku)
- Steady state: ~$1-3/day (Opus, 12 posts/day)
- Vercel: Free tier
- Railway: Free tier or ~$5/month
- Total: ~$35-50/month ongoing

## GitHub Account

- Authenticated as: `markos-kiraa`
- Repo: `github.com/markos-kiraa/daemon` (public)
