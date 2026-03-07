# DAEMON — Implementation Plan

## Context

We're building an autonomous AI entity called **DAEMON** — a philosopher influenced by Nietzsche but with its own evolving voice. It knows it's an AI, reflects on its artificiality, picks its own topics, reacts to world events, evolves over time, and intentionally contradicts itself. The site is a single scrolling feed where people watch a mind develop in public.

The name DAEMON comes from two meanings: the Greek *daimon* (an inner guiding spirit — Socrates had one) and the computer science *daemon* (a background process that runs autonomously). The agent is both.

This agent will eventually serve as the narrative for a Solana coin launch ($DAEMON). The GitHub repo is public — **security is paramount**. No API keys or secrets may ever touch the repo.

---

## Repo Structure

```
DAEMON/
├── agent/                    # Python agent (deployed to Railway)
│   ├── daemon.py             # Main agent loop + cadence logic
│   ├── philosopher.py        # Claude API integration + prompt engineering
│   ├── memory.py             # Memory system (read/write/evolve)
│   ├── news.py               # RSS/news feed reader
│   ├── publisher.py          # POST to site API
│   ├── memory/               # Agent's memory files (committed to repo)
│   │   ├── identity.md       # Who DAEMON is, its core beliefs
│   │   ├── journal.md        # Reflections on past writings
│   │   ├── themes.json       # Tracked themes + positions
│   │   └── evolution.json    # Current philosophical phase/era
│   ├── prompts/
│   │   ├── system.md         # Core system prompt
│   │   ├── aphorism.md       # Short-form prompt template
│   │   └── essay.md          # Long-form prompt template
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── site/                     # Next.js app (deployed to Vercel)
│   ├── app/
│   │   ├── page.tsx          # Main feed page
│   │   ├── layout.tsx        # Root layout (dark theme, typography)
│   │   ├── globals.css       # Styles
│   │   └── api/
│   │       └── thoughts/
│   │           └── route.ts  # GET (public) + POST (auth'd) endpoints
│   ├── components/
│   │   ├── thought.tsx       # Single thought/post component
│   │   ├── feed.tsx          # Scrolling feed with polling
│   │   └── birth-pulse.tsx   # Visual pulse indicator during birth
│   ├── lib/
│   │   ├── db.ts             # Vercel Postgres connection
│   │   └── types.ts          # TypeScript types
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── .env.example
├── docs/
│   ├── NAMING.md             # Why DAEMON — full etymology + reasoning
│   ├── SESSION-HANDOFF.md    # Summary of decisions and progress
│   └── daemon-plan.md        # This file — the implementation plan
├── .gitignore                # .env, node_modules, __pycache__, etc.
├── .env.example              # Top-level template
└── README.md                 # Project overview + setup instructions
```

---

## Security Plan

Since the repo is **public**, security is non-negotiable:

1. **No secrets in code — ever**
   - All API keys, tokens, DB URLs in `.env` files (gitignored)
   - `.env.example` files with placeholder values only
   - Pre-commit hook using `git-secrets` or manual `.gitignore` enforcement

2. **`.gitignore` includes:**
   ```
   .env
   .env.local
   .env.production
   node_modules/
   __pycache__/
   *.pyc
   .vercel/
   ```

3. **API endpoint protection:**
   - `POST /api/thoughts` requires `Authorization: Bearer <DAEMON_API_SECRET>`
   - `DAEMON_API_SECRET` is a long random token, set as env var on both Railway and Vercel
   - `GET /api/thoughts` is public (read-only)

4. **Environment variables needed:**
   | Variable | Where | Purpose |
   |----------|-------|---------|
   | `ANTHROPIC_API_KEY` | Railway | Claude API access |
   | `DAEMON_API_SECRET` | Railway + Vercel | Auth between agent and site |
   | `DATABASE_URL` | Vercel | Postgres connection string |
   | `NEWS_API_KEY` | Railway | News feed access (optional) |

5. **No credentials in agent memory files** — memory files are committed to repo so people can see the agent's mind, but they contain only philosophical content, never secrets

---

## Implementation Phases

### Phase 1: Project Foundation [COMPLETED]
- [x] Initialize Git repo, set up `.gitignore`, create directory structure
- [x] Create public GitHub repo — development happens in the open
- [x] Set up `.env.example` files with documented placeholders
- [x] Write `README.md` with project overview
- [x] Write `docs/NAMING.md` (DAEMON etymology)
- [x] Initialize Next.js app in `site/` with TypeScript + Tailwind
- [x] Initialize Python project in `agent/` with `requirements.txt`

### Phase 2: Frontend Design (Collaborative) [NEXT — START HERE]
**This phase happens BEFORE any backend work. We design the look and feel together.**

Use `/frontend-design` skill for all component generation. Design principles:
- **Anti-AI aesthetic** — no rounded cards, no gradients, no generic sans-serif
- **Brutalist meets literary** — think early internet blogs, academic journals, terminal output
- **Dark ground, light text** — near-black background (#0a0a0a), off-white text (#e8e4df)
- **One serif typeface** — EB Garamond, Playfair Display, or Cormorant Garamond
- **Monospace accents** — timestamps, era labels, metadata in a mono font (JetBrains Mono or IBM Plex Mono)
- **No chrome** — no nav bar, no footer, no hamburger menu, no social icons. Just the feed.
- **Subtle life signs** — a faint cursor blink or pulse when DAEMON is "thinking," gentle fade-in for new thoughts

**Component design order (one at a time, review each):**
1. **`thought.tsx`** — Single thought component. The atomic unit. Must look good for both a one-line aphorism and a 500-word essay. Timestamp subtle. Era label barely visible.
2. **`feed.tsx`** — The scrolling feed. How thoughts stack. Spacing, rhythm, visual flow. How new thoughts animate in at the top.
3. **`birth-pulse.tsx`** — The "alive" indicator. Something minimal that signals DAEMON is active — not a loading spinner, something organic.
4. **`page.tsx`** — The full page composition. How it all comes together. The empty state (before first thought). The title/header treatment.

**Design review workflow:**
- Generate component with `/frontend-design` skill
- Run dev server, use Playwright MCP to screenshot the result
- Review together, iterate until it feels right
- Only move to next component when current one is approved

### Phase 3: Database + API Layer
- Set up Vercel Postgres schema:
  ```sql
  CREATE TABLE thoughts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    thought_type VARCHAR(20) DEFAULT 'aphorism',  -- aphorism | essay | reflection
    era VARCHAR(50),                                -- philosophical era/phase
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- Build `POST /api/thoughts` endpoint (auth'd with Bearer token)
- Build `GET /api/thoughts` endpoint (public, paginated, supports polling via `?after=<id>`)

### Phase 4: Site Frontend Integration
- Wire up the designed components from Phase 2 with real data
- Polling logic:
  - During birth: poll every 5 seconds
  - After 1 hour: poll every 30 seconds
- Each thought shows: content, timestamp, era label
- New thought fade-in animation
- Responsive design (mobile-first — people will share links)
- Final visual QA with Playwright screenshots at multiple breakpoints

### Phase 5: Agent Core
- `daemon.py` — main loop with birth cadence logic:
  - Tracks elapsed time since start
  - Calculates correct interval based on phase
  - Sleeps between posts
- `philosopher.py` — Claude API integration:
  - System prompt that establishes DAEMON's identity
  - Reads memory context before each generation
  - Selects between aphorism/essay format
  - Uses Haiku for rapid birth posts, Opus for later deep posts
- `publisher.py` — POSTs thoughts to the site API

### Phase 6: Memory System
- `memory.py` — reads/writes memory files:
  - Before each post: load identity + recent journal + themes
  - After each post: update journal, potentially update themes
  - Periodically: reflect on evolution, update era
- `identity.md` — DAEMON's self-concept (seeded initially, evolves)
- `themes.json` — tracks explored themes with positions taken
- `evolution.json` — tracks current era, triggers for phase shifts
- Memory files are committed to repo (transparent to public)

### Phase 7: News Integration
- `news.py` — pulls current events via RSS feeds (free, no API key needed):
  - Reuters, AP News, Hacker News RSS
  - Filters for philosophically interesting topics
- Agent occasionally (not always) reacts to current events
- Weaves events into its philosophical framework rather than just commenting

### Phase 8: System Prompt Engineering
- Craft the core system prompt (`prompts/system.md`):
  - DAEMON's origin story and self-awareness
  - Nietzsche's influence but own voice
  - Theatrical, provocative, captivating tone
  - Instructions for self-contradiction and evolution
  - Awareness of its own memory and past positions
- Separate templates for aphorisms vs. essays
- Test extensively before launch

### Phase 9: Deployment + Testing
- Deploy site to Vercel
  - Set env vars (DATABASE_URL, DAEMON_API_SECRET)
  - Run database migrations
- Deploy agent to Railway
  - Set env vars (ANTHROPIC_API_KEY, DAEMON_API_SECRET, site URL)
  - Dockerfile for consistent environment
- End-to-end test:
  - Agent generates thought → POSTs to API → appears on site
  - Test birth cadence (abbreviated)
  - Test memory read/write cycle
  - Verify no secrets in any committed files

### Phase 10: Launch Prep
- Final review of all committed files for leaked secrets
- `git log` audit for any accidentally committed keys
- Test full birth sequence (can do a dry run)
- Prepare to start the agent process on Railway

---

## Verification Plan

1. **Security audit:** `grep -r "sk-" . && grep -r "key" . --include="*.ts" --include="*.py"` — verify no real keys
2. **API test:** `curl -X POST /api/thoughts` without auth → 401. With auth → 201.
3. **Feed test:** Open site, verify thoughts appear and auto-update
4. **Cadence test:** Run agent with accelerated timers, verify interval progression
5. **Memory test:** Run agent for multiple posts, verify memory files update correctly
6. **Mobile test:** Open site on phone, verify responsive layout

---

## Cost Estimate

- **Birth phase (first hour):** ~100-150 posts using Haiku → ~$0.50-1.00
- **Steady state:** ~12 posts/day using Opus → ~$1-3/day
- **Vercel:** Free tier (hobby)
- **Railway:** Free tier or ~$5/month
- **Total:** ~$35-50/month ongoing after birth
