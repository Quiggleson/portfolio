# CLAUDE.md — <app-name>

> Template. Copy to the root of a new sub-app repo as `CLAUDE.md`, then replace every
> `<...>` placeholder and delete the instruction blockquotes. Keep the section order —
> the PWA, routing, and workflow sections are the parts that must not drift between apps.

## What this is

<One or two sentences: what the app does and who uses it.>

- **Live at:** https://www.quiggleson.com/<app-name>
- **Repo:** https://github.com/Quiggleson/<repo-name>
- **Parent site:** the [portfolio repo](https://github.com/Quiggleson/portfolio) owns `quiggleson.com`
  and links to this app from its home page. Its `CLAUDE.md` holds the shared architecture.

## Agent workflow — read this first

This repo is edited by coding agents driven from Slack. The human is the gate.

- **Never push to `main`.** Work on a branch, commit, open a PR.
- **Never deploy.** `npm run deploy`, `wrangler deploy`, and anything that publishes are the
  human's to run. An agent's job ends at the PR.
- **Never add `Co-Authored-By` lines** to commit messages.
- **Never remove checklist items** from a PR template; leave unchecked boxes in place.
- Branch names: `slack/<short-slug>` for Slack-driven work, `fix/<slug>` or `feat/<slug>` otherwise.
- PR body: lead with the verbatim Slack instruction that prompted the change, then what you did
  and anything you deliberately left out. The human reviews from Slack and may only read this body.
- If the instruction is ambiguous, implement the most conservative reading and say so in the PR
  body. Do not expand scope beyond the message.

## Mounting at a subpath

The app is served from `/<app-name>/`, not from a domain root. This is the single biggest source
of bugs in these repos.

`quiggleson.com` is a Cloudflare **Custom Domain** bound to the portfolio Worker, which makes that
Worker the origin for every path. This app attaches as **path routes**. Cloudflare runs route
Workers before a Custom Domain Worker, so this app answers its own subpath before the portfolio
Worker sees the request.

In `wrangler.jsonc`:

```jsonc
{
  "name": "<app-name>",
  "routes": [
    { "pattern": "quiggleson.com/<app-name>", "zone_name": "quiggleson.com" },
    { "pattern": "quiggleson.com/<app-name>/*", "zone_name": "quiggleson.com" },
    { "pattern": "www.quiggleson.com/<app-name>", "zone_name": "quiggleson.com" },
    { "pattern": "www.quiggleson.com/<app-name>/*", "zone_name": "quiggleson.com" }
  ]
}
```

Two things that bite:

- **Both hostnames.** The apex and `www` are separate Custom Domains on the portfolio Worker.
  Register routes for both or `www` visitors land on the portfolio instead of this app.
- **Bare path and wildcard.** `/<app-name>/*` does not match `/<app-name>` with no trailing
  slash. Register both patterns.

Never widen a pattern. `quiggleson.com/*` would take over the whole site.

Consequences for the code:

- Every internal link, asset path, fetch URL, manifest field, and service worker path must carry
  the `/<app-name>` prefix. Root-absolute paths like `/icon.png` resolve to the portfolio, not here.
- **Static assets are looked up by the full request path.** Workers Static Assets never strips the
  route prefix, so a request for `/<app-name>/index.html` needs the file at
  `<assets-dir>/<app-name>/index.html`. Build into a subfolder named after the app, or every
  request 404s.
- Next.js: set `basePath: '/<app-name>'` in `next.config.mjs` and route client-side URLs through
  `process.env.NEXT_PUBLIC_ROOT_PATH`.
- Vite: set **both** `base: '/<app-name>/'` and `build.outDir: 'dist/<app-name>'`, with
  `"assets": { "directory": "./dist" }` in `wrangler.jsonc`. `base` alone only rewrites URLs.

## PWA requirements

Each app is an independently installable PWA. Its service worker must be scoped to the subpath so
the apps cannot interfere with each other or with the portfolio.

- **Manifest** at `/<app-name>/manifest.webmanifest`, linked from the document head:
  - `"scope": "/<app-name>/"`
  - `"start_url": "/<app-name>/"`
  - `"display": "standalone"`
  - `"name"`, `"short_name"`, `"theme_color"`, `"background_color"`
  - icons at 192x192 and 512x512, plus a 512x512 `"purpose": "maskable"`
- **Service worker** served from `/<app-name>/sw.js`. A worker's default scope is the directory it
  is served from, so serving it at the subpath confines it there. Never serve it from the domain
  root — it would hijack the whole site.
- Register with an explicit scope: `navigator.serviceWorker.register('/<app-name>/sw.js', { scope: '/<app-name>/' })`.
- Cache the app shell so the thin client opens offline; a queued action should survive a cold start.
- Bump the cache name on any change to cached assets, or installed clients keep the stale shell.
- Vite apps: use `vite-plugin-pwa`. Vite emits hashed filenames that a hand-written service
  worker cannot know to precache, and Workbox revisions files by content hash, which takes care
  of the cache-name rule above. [Quiggleson/pilot](https://github.com/Quiggleson/pilot) is the
  reference setup.

## Commands

> Fill in from this repo's `package.json`. Mark anything that publishes as human-only.

```
<npm run dev>      # local dev server
<npm run build>    # production build
<npm run lint>     # lint
<npm test>         # tests
<npm run deploy>   # HUMAN ONLY — publishes to quiggleson.com/<app-name>
```

## Stack

<Language, framework, styling, state, test runner — and why, if the choice was deliberate.>
<Stack is chosen per app; there is no house default beyond the routing and PWA rules above.>

## Layout

```
<key directories and what lives in them>
```

## Conventions

<Project-specific conventions: naming, state handling, styling tokens, error handling.>

- Match the surrounding code's idiom, naming, and comment density.
- Comments explain *why*, never restate *what*. Self-explanatory code gets no comment.

## Known gotchas

<Running list. Anything that cost a debugging session belongs here.>

- **Wrangler 4.87+ requires Node 22+** and fails outright on Node 20. Pin it with `.nvmrc`.
- **Cached 308 loop.** Before this app exists, the portfolio answers `/<app-name>/` with a
  permanent 308 → `/<app-name>`. A browser that cached it loops against this app's
  `/<app-name>` → `/<app-name>/` redirect. Don't visit the path before the first deploy. If you
  did, clear site data or use a private window.

## New repo checklist (human)

- [ ] Repo created under `Quiggleson/` with `gh repo create --add-readme`, so `main` never needs
      a direct push. PR-only: protect `main`, require a PR before merge, and **include
      administrators** (`enforce_admins`). Agents use the owner's admin token, and without it
      protection doesn't stop them.
- [ ] `wrangler.jsonc` routes for all four patterns above.
- [ ] Cloudflare API token in repo secrets if deploys are automated on merge.
- [ ] Manifest and service worker scoped to `/<app-name>/`.
- [ ] Verified installable from `https://www.quiggleson.com/<app-name>` on a phone.
- [ ] Linked from the portfolio home page preview list.
- [ ] This file filled in, placeholders gone.
