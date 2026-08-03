# CP local, GitHub, Vercel, and Emergent comparison

Date: 2026-07-31
Status: **Partial — Emergent source inspection is blocked at authentication.**
Audit boundary: read-only inspection; no push, deploy, production change, Shopify write, purchase, or Emergent generation was performed.

## Executive comparison

| Surface | Exact state observed | What it means |
| --- | --- | --- |
| Local workspace | Branch `codex/restore-production-visual-direction`, committed HEAD `93d8b3966805c995eb73ee2140ae4ca7812b8243`; 21 commits ahead of GitHub `main` and 0 behind | This is the newest inspected implementation, but it exists only locally. It is not a GitHub branch, Vercel Preview, or production deployment. |
| GitHub | Canonical remote `https://github.com/CubiqoUnited/carlophillips-site.git`; `main` and the persistent `staging` branch both point to `d172cfb70e7eb2d2bf0f690b477070656c66ce86`; remote feature branch `fix-signature-hoodie-staging-preview` points to `425f50babb18668fa7a12e7bf4ea9d4d99c1b84b` | GitHub does not contain the local correction branch or commit. The persistent remote `staging` branch also conflicts with the newly declared one-permanent-branch model and will need an approved cleanup later; it was not deleted in this audit. |
| Vercel Production | Project `carlophillips-site`; Production tracks GitHub `main` at `d172cfb`; `www.carlophillips.com` returns HTTP 402 / `Deployment Paused` | Production is the older GitHub-main implementation, but its UI cannot currently be inspected live because the deployment is disabled. |
| Vercel latest Preview | Branch `fix-signature-hoodie-staging-preview`, commit `425f50b`; Preview URL returns HTTP 402 / deployment disabled | Preview is neither current GitHub main nor current local HEAD, and it is also inaccessible due to the account/deployment state. |
| Emergent | `https://app.emergent.sh/landing/` shows the signed-out landing page | No Emergent project list, files, source tree, framework, commit/export state, or rendered CARLOPHILLIPS app could be inspected. Public `customer-assets.emergentagent.com` URLs in local configuration prove only asset hosting, not the contents or currency of an Emergent project. |

## Code delta: local versus GitHub/Vercel production source

The local HEAD differs from GitHub/Vercel production source by **245 files: 22,606 insertions and 4,179 deletions** (213 added, 22 modified, 10 deleted).

Important observable differences:

- Local uses Next.js `15.5.21`, React/React DOM `19.2.8`, Yarn Classic `1.22.22`, and supplies lint, tests, dependency audit, and aggregate verification scripts.
- GitHub/Vercel production source uses Next.js `14.2.3`, React 18, and has only development/build/start scripts.
- Local removes `/about` and `/lookbook`, retains `/`, `/bag`, `/cart`, `/collections`, `/shop`, `/products/[handle]`, and adds the release-aware server/API boundaries and evidence contracts developed on the fitness branch.
- GitHub/Vercel production still builds `/about` and `/lookbook` and lacks those later local controls.
- Local's home screen is a black, product-led, release-gated storefront. Its DOM explicitly reports the Signature Hoodie candidate as withheld and does not imply purchasing authority. The direct screenshots also expose a current presentation defect: key header/hero copy and imagery are visibly clipped at both tested widths, especially at 390px.
- Because Vercel returns only the platform pause screen, this audit cannot make a visual claim about the underlying deployed main UI beyond the verified build source and route manifest.

## Verification and visual evidence

Local verification command:

`node /Users/edv/.cache/node/corepack/v1/yarn/1.22.22/bin/yarn.js verify`

Result:

- ESLint: passed with zero errors/warnings.
- Tests: 32 files, 309 tests passed.
- Dependency audit: 0 advisories across 193 packages.
- Next.js 15.5.21 production build: passed, 11 routes emitted.
- Local HTTP check: 200.
- Production HTTP check: 402.
- Latest Preview HTTP check: 402.
- Desktop local check: 1280px direct page capture; product-led release-gated DOM rendered, but the screenshot shows horizontally clipped header/hero content.
- Mobile local check: 390x844 direct page check; DOM reported `scrollWidth 384` for `innerWidth 390`, but the screenshot still shows content clipped by presentation transforms/positioning. A simple overflow-width assertion therefore does not establish mobile fitness.
- Desktop/mobile Vercel checks: direct page captures both rendered `Deployment Paused`.

Evidence files:

- `reports/emergent-audit/local-93d8b39-desktop.png`
- `reports/emergent-audit/local-93d8b39-mobile.png`
- `reports/emergent-audit/vercel-production-402-desktop.png`
- `reports/emergent-audit/vercel-production-402-mobile.png`
- `reports/emergent-audit/emergent-sign-in-blocker-desktop.png`

## Emergent blocker and exact resume point

Human action is required in the existing Codex in-app browser:

1. Sign in at `https://app.emergent.sh/landing/`.
2. Open the CARLOPHILLIPS project.
3. Leave that project screen open and reply `Emergent ready`.

Do not accept a paid plan, consume credits, regenerate, deploy, publish, or connect/change GitHub or billing during this handoff. After the signal, resume with a read-only inspection of the Emergent source tree, routes, dependencies, Git/export metadata, and desktop/mobile rendering. Only then can the requested four-way comparison be completed.

The same instruction is recorded in `reports/HUMAN_INTERVENTION_STICKY_RED.md`.

## Working-tree ownership

Pre-existing user-owned changes preserved and not modified by this audit:

- modified `AGENTS.md`
- untracked `PROJECT-NOTES.md`

Audit-created, deliberately uncommitted evidence:

- `reports/HUMAN_INTERVENTION_STICKY_RED.md`
- `reports/emergent-audit/*`

No source code was edited and no files were staged or committed.
