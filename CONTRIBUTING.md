# Contributing to Placidchills

Thank you for helping build the Placidchills platform. This document explains how the repository is organized and how to work on it safely.

## Start here

1. Read [`docs/00_PROJECT_CONTEXT.md`](./docs/00_PROJECT_CONTEXT.md) — what this project is
2. Read [`docs/10_AI_INSTRUCTIONS.md`](./docs/10_AI_INSTRUCTIONS.md) — file map and rules
3. Check [`docs/07_SPRINT_BACKLOG.md`](./docs/07_SPRINT_BACKLOG.md) — **only work on the active sprint**
4. Follow [`docs/09_CODING_STANDARDS.md`](./docs/09_CODING_STANDARDS.md)

The `/docs` directory is the single source of truth. Update docs in the same change when you alter architecture, schema, or engineering decisions.

## Branch strategy

| Branch | Purpose |
|--------|---------|
| **`main`** | Production-ready code. Vercel deploys from here. Always buildable. |
| **`feat/sprint-N-short-name`** | Sprint feature work (e.g. `feat/sprint-1-revenue`) |
| **`fix/short-description`** | Bug fixes |
| **`docs/short-description`** | Documentation-only changes |
| **`chore/short-description`** | Tooling, CI, dependencies |

### What stays on `main`

- Completed, reviewed sprint increments
- Documentation that matches the code on `main`
- CI configuration that passes lint + build

### What does **not** stay on `main`

- Work-in-progress from the next sprint
- Placeholder content or half-finished features
- Broken builds

### Sprint workflow

1. Branch from `main`: `git checkout -b feat/sprint-1-revenue`
2. Implement only that sprint's deliverables (see `docs/07_SPRINT_BACKLOG.md`)
3. Update relevant docs (`06`, `08`, `11` as needed)
4. Open a pull request into `main`
5. Ensure CI passes (`lint` + `build`)
6. Merge when sprint acceptance criteria are met
7. Delete the feature branch after merge

**Do not** keep parallel long-lived sprint branches. One active sprint branch at a time.

### Tags (optional)

After each sprint is merged and deployed, tag a release milestone:

```bash
git tag -a sprint-0 -m "Sprint 0: Pre-launch blockers"
git push origin sprint-0
```

## Local setup

```bash
git clone <repo-url>
cd Artist_Website/web
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

See [`README.md`](./README.md) for environment variables and deployment.

## Pull request checklist

- [ ] Scope matches current sprint (or is a small fix/docs/chore)
- [ ] `npm run lint` passes in `web/`
- [ ] `npm run build` passes in `web/`
- [ ] No secrets in committed files (`.env` stays gitignored)
- [ ] No placeholder content shipped to user-facing pages
- [ ] Docs updated if architecture, schema, or decisions changed

## Code location

All production code lives in `web/`. The `legacy/` folder is reference-only — do not extend it.

## Questions

Product and architecture decisions are logged in [`docs/11_DECISION_LOG.md`](./docs/11_DECISION_LOG.md). If something is unclear or blocked, open an issue before implementing assumptions.
