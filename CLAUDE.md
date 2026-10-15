# CLAUDE.md — portfolio

Personal portfolio and the hub for a family of subpage PWAs. Next.js 14 (app router),
TypeScript, Tailwind. Live at **https://www.quiggleson.com**.

The repo is known to be messy; do not reorganize or clean it up unless asked.

## Agent workflow — read this first

- **Never push to `main`.** Work on a branch, commit, open a PR.
- **Never deploy.** `npm run deploy` and `wrangler deploy` publish straight to the live domain and
  are the human's to run. An agent's job ends at the PR.
- **Never add `Co-Authored-By` lines** to commit messages.
- **Never remove checklist items** from a PR template; leave unchecked boxes in place.
- `npm install` first — `node_modules` is not checked in and is often absent.

## Hosting

Served by a **Cloudflare Worker** built with `@opennextjs/cloudflare`. Verified Oct 2026: the live
response carries `x-opennext: 1`, the zone uses Cloudflare nameservers, and
[wrangler.jsonc](wrangler.jsonc) binds both `quiggleson.com` and `www.quiggleson.com` as Custom
Domains.

**It is not on GitHub Pages.** It was, years ago, and the leftovers still mislead:
`NEXT_PUBLIC_ROOT_PATH` in [.env.production](.env.production) (now `""`, formerly the Pages
subpath) and the stale "will link incorrectly on github pages" comment in
[app/topnav.tsx](app/topnav.tsx). The `basePath` plumbing those feed is still live and still useful
— see the subpage architecture below — but the Pages deployment is gone.

Pages was evaluated again and rejected: [app/actions/](app/actions/) is four `"use server"` Server
Action files that `/sat` depends on, and static export cannot run them. Cloudflare's free tier
(100k requests/day, static assets free and unlimited) covers this site with room to spare.

There is **no CI** — no `.github/` directory, so nothing deploys on merge. Deploys are manual and
require `wrangler login`.

## Commands

```
npm run dev         # dev server on :3000
npm run build       # next build
npm run lint        # eslint
npm test            # jest — configured, but there are currently zero test files
npm run preview     # opennext build + local Worker preview
npm run deploy      # HUMAN ONLY — publishes to quiggleson.com
npm run cf-typegen  # regenerate cloudflare-env.d.ts from wrangler.jsonc
```

## Layout

```
app/
  page.tsx            home page; hardcoded `previews` array drives the section cards
  layout.tsx          root layout, fonts (Inter/Nunito), TopNav
  topnav.tsx          site nav; links are basePath-prefixed
  components/         Preview card, Button
  models/projects.tsx project data as a plain exported array (edit here to add a project)
  projects/           projects page
  research/           research pages + PDF viewer (react-pdf / pdfjs-dist)
  sat/                3SAT analysis tool — the largest subsystem (~1.3k lines)
  lib/graph/          SAT domain model: Instance, Clause, Connections, Terminal
  actions/            "use server" Server Actions backing the SAT tool
  store/              zustand store
  api/session/init/   issues a session-id cookie consumed by the Server Actions
public/               images, PDFs, SAT docs media (.webm walkthroughs)
docs/                 the sub-app CLAUDE.md template
```

## Conventions

- Tailwind only; semantic colors are defined in [tailwind.config.ts](tailwind.config.ts)
  (`bg-light`, `button-hover`, `surface`, `purple-com`, `warning`, …). Use the tokens, not raw hex.
- Custom animations also live in the Tailwind config (`fadeInBottom`, `expandW`, …).
- `'use client'` only where interactivity requires it; server components are the default.
- Client-side links go through `process.env.NEXT_PUBLIC_ROOT_PATH` so the app survives being
  mounted under a subpath.
- Comments explain *why*, never restate *what*. Self-explanatory code gets no comment.
- TS is `strict`; `@/*` is aliased to the repo root.

## Known gotchas

- [app/lib/graph/instanceStore.ts](app/lib/graph/instanceStore.ts) holds per-session state in a
  module-level `Map`. That is not durable across Cloudflare Worker isolates, so SAT's server state
  is unreliable in production. Known, unfixed.
- `npm test` with zero test files exits non-zero. Don't read that as a broken build.
- The home page `previews` array in [app/page.tsx](app/page.tsx) is hand-maintained and separate
  from [app/models/projects.tsx](app/models/projects.tsx); new sections must be added there.

## Subpage PWA architecture

The active project: installable PWAs mounted at `quiggleson.com/<app-name>`, each in **its own
repo**, updated through a Slack → coding agent → PR workflow. Background and the message-bus design
are in [Slack-Driven Vibe-Coding App — Setup Plan.md](<Slack-Driven Vibe-Coding App — Setup Plan.md>)
— note that its hosting section assumes GitHub Pages and is stale; routing works as described below.

**How a separate repo claims a subpath.** The portfolio Worker holds the Custom Domain, which makes
it the origin for every path on the hostname. A sub-app attaches Cloudflare **path routes**
instead. Route Workers run before a Custom Domain Worker, so the sub-app answers its own subpath
before the portfolio Worker sees the request. Two traps: the apex and `www` are separate Custom Domains, so a sub-app
must register routes for both; and `/<app>/*` does not match `/<app>` without the trailing slash,
so both patterns are needed. Four patterns per app, in that repo's `wrangler.jsonc`. Static
assets are looked up by the full request path, so a sub-app's build must sit under an `<app>/`
folder inside its assets directory.

**Reference implementation:** [Quiggleson/pilot](https://github.com/Quiggleson/pilot), live at
`/pilot`. It's a Vite + TS hello PWA that proved this setup end to end in Oct 2026. Copy its
`vite.config.ts`, `wrangler.jsonc`, and `scripts/smoke.sh` rather than starting from scratch.

**Nothing in this repo needs to change for a sub-app to go live** — no proxy, no rewrite, no route
config here. The only portfolio-side change is adding a link to the `previews` array on the home
page so the app is discoverable.

**Where things live.** Each PWA is one repo. The Slack worker that listens for messages and opens
PRs is a third thing — its own repo, never this one and never a sub-app.

### Spinning up a new sub-app repo

1. Create the repo under `Quiggleson/` with `gh repo create --add-readme`, then protect `main`
   to require a PR with `enforce_admins` on (see the template's checklist for why).
2. Copy [docs/subapp-CLAUDE.template.md](docs/subapp-CLAUDE.template.md) to that repo's root as
   `CLAUDE.md`, fill in every `<...>` placeholder, and delete the instruction blockquotes.
3. Pick the stack per app — there is no house default beyond the routing and PWA rules in the
   template. Thin Slack clients do not need a server; this repo's Next.js setup is not a mandate.
4. Add the four route patterns and scope the manifest and service worker to `/<app-name>/`.
5. Add the link to the `previews` array in [app/page.tsx](app/page.tsx) here, via PR.

When the routing or PWA rules change, update the template in [docs/](docs/) and this section
together — the template is the contract every sub-app repo inherits.
