# Slack-Driven Vibe-Coding App — Setup Plan

Oct 13, 2026 · @Quiggleson

A single Slack channel is the shared message bus between two interfaces; a worker turns its messages into GitHub pull requests, a coding agent writes the code, and you review and approve PRs. Nothing hits `main` automatically.

## Core idea

One Slack channel acts as the shared message bus. Both interfaces just produce messages in that channel — that's the whole contract. A worker watches the channel and turns each message into a GitHub pull request via a coding agent. You stay the gate: the agent never pushes to `main`, it only opens PRs for you to review and approve.

## Two interfaces

Both are thin clients that only write to the one Slack channel.

1. **Commute (voice):** Talk to Claude by voice; Claude posts a record of the intended changes into the Slack channel.
2. **At home (text):** Type directly into the same Slack channel.

## End-to-end flow

1. **Capture** — either interface drops a message into the Slack channel.
2. **Listen** — the worker catches the Slack event and parses the instruction.
3. **Branch** — the worker kicks off the coding agent on a fresh branch in a sandbox.
4. **PR** — the agent commits and opens a PR via the GitHub API.
5. **Notify** — the worker posts the PR link back to Slack with approve / reject buttons.
6. **Approve** — you approve from either interface, and that merges the PR.

## Hosting

- **Front end (PWA):** GitHub Pages. Static hosting only, which is a perfect fit for the thin-client PWA — and there's already a site there. Chosen over a Play Store early-access app: no review process, instant updates, works on any device.
- **Worker:** GitHub Pages **cannot** run the worker (static only). The worker needs to be running to listen for Slack events and call the GitHub API, so it lives separately from Pages.

**Multiple apps, one domain (subpaths):** Set the custom domain on the user site repo (`username.github.io`) and it automatically applies to every project site under the account. Each app is then its own repo published as a project site, appearing at `your-domain/app-name` — three repos, one domain, three subpaths, no per-repo domain config. Each app is its own installable PWA: give it its own manifest and a service worker scoped to its subpath (a worker at `/app-one/` controls that folder only), so the apps stay independent. Prefer subpaths over subdomains — subdomains work but need a separate DNS record and CNAME per app.

## Worker options

### Option A — Laptop-first (recommended to start)

- A small Node or Python process on the laptop (\~50 lines to start), left running.
- Use **Slack Socket Mode**: an outbound websocket from the laptop to Slack, so **no public URL or tunnel** (ngrok, Cloudflare Tunnel) is needed. This is the move for a laptop worker.
- Caveat: it only runs while the laptop is awake and online. Commute messages simply **queue up in Slack** and get processed once home / running — fine here, since you're the one approving PRs anyway.

### Option B — Graduate to always-on (later)

- Lift the **same code** into a serverless function (e.g. a Cloudflare Worker). Basically free.
- Enables processing commute messages in real time rather than queued.

## Design notes

- The coding agent writes changes; **you review and approve PRs** — the agent never pushes to `main` directly.
- Agent harness options: GitHub Copilot workspace, or Claude in a CI-style harness. The cheapest working version is a worker that spins up the agent in a sandbox, commits to a branch, and opens the PR via the GitHub API.
- Keep approvals **in Slack** (PR link plus approve / reject buttons), so voice-approval works on the commute too.

## Open questions / next steps

- [ ] Pick the agent harness.
- [ ] Decide the sandbox environment for the agent.
- [ ] Define the message format / convention the worker parses.
