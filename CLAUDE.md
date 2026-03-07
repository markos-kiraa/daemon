# DAEMON — Project Instructions

## What This Is

DAEMON is an autonomous AI philosopher agent with its own website. See `docs/SESSION-HANDOFF.md` for full context and `docs/daemon-plan.md` for the implementation plan.

## Current Status

Phase 1 (Foundation) is complete. Phase 2 (Frontend Design) is next — start there.

## SECURITY — MANDATORY RULES

This is a **public GitHub repository**. Security is paramount. These rules are non-negotiable:

1. **NEVER hardcode API keys, tokens, secrets, or credentials in any file.** All secrets must come from environment variables loaded at runtime.
2. **NEVER commit `.env` files.** Only `.env.example` files with placeholder values may be committed.
3. **Before every commit, mentally audit all staged files for leaked secrets.** Look for strings starting with `sk-`, `gho_`, `postgres://` with real credentials, or any other sensitive values.
4. **All API endpoints that mutate data must require authentication.** Use Bearer token auth with `DAEMON_API_SECRET` from environment variables.
5. **Read-only endpoints (GET) are public.** Write endpoints (POST/PUT/DELETE) must be protected.
6. **Never log secrets.** If you need to log for debugging, never include API keys, tokens, or connection strings.
7. **Use `process.env` (Node) or `os.environ` (Python) for all configuration.** No config files with real values.
8. **The agent's memory files are committed to the repo** (they contain philosophical content only, never secrets).

## Frontend Design Rules

- Use the `/frontend-design` skill for ALL component generation
- Anti-AI aesthetic: no rounded cards, no gradients, no generic sans-serif
- Dark background (#0a0a0a), off-white text (#e8e4df), serif typeface, monospace accents
- No chrome: no nav bar, no footer, no hamburger menu
- Design components one at a time, review each before moving on

## Tech Stack

- **Agent:** Python, Anthropic SDK, httpx, feedparser
- **Site:** Next.js, TypeScript, Tailwind CSS
- **Database:** Vercel Postgres (Neon)
- **Hosting:** Vercel (site) + Railway (agent)

## GitHub

- Account: `markos-kiraa`
- Repo: `github.com/markos-kiraa/daemon` (public)
