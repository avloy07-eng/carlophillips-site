# CP source, design, and launch decision

Date: 2026-08-02  
Status: decision-ready for local/GitHub/Vercel; Emergent project-source audit awaits specific visible-navigation approval.

## Bottom line

Use local commit `93d8b3966805c995eb73ee2140ae4ca7812b8243` on `codex/restore-production-visual-direction` as the implementation candidate.

It is the only inspected source that combines:

- the product-first, full-height visual direction recovered from historical commit `9e1f5c3`;
- the current Next.js 15 / React 19 supported runtime;
- fail-closed Shopify, release, media, cart, and environment boundaries;
- deletion of the non-PRD editorial About/Lookbook detour;
- a complete local lint/test/audit/build gate.

Do not adopt remote `main`, the current Vercel deployment, or the Emergent project as a replacement codebase. Remote `main` is the older editorial-shell source; Vercel serves that same source but is disabled; Emergent currently supplies useful concept imagery and may contain a design implementation, but its actual source has not yet been inspected and its generated images are not verified product truth.

## Exact state by surface

| Surface | Exact observed state | Fitness for the goal |
| --- | --- | --- |
| Local | `codex/restore-production-visual-direction` at `93d8b39`; 21 commits ahead of remote `main`; 245-file delta | Best candidate. Full local verification passes. Not pushed or deployed. |
| GitHub `main` | `d172cfb`; latest message `docs: record domain redirect deployment verification` | Canonical production branch, but it contains the editorial-shell era and lacks the later correction/safety work. |
| GitHub `staging` | Also `d172cfb` | Redundant permanent staging branch; target model says staging should be temporary PR Preview, not a permanent branch. Do not delete without approval. |
| GitHub feature branch | `fix-signature-hoodie-staging-preview` at `425f50b` | Older Hoodie migration candidate; latest Vercel Preview is built from it, not from the local correction. |
| Vercel Production | `carlophillips-site`, Production deployment from `main@d172cfb`; project reports `live: false` | Build exists, but public service is unavailable. |
| `www.carlophillips.com` | HTTP 402 from Vercel, `Deployment Paused` / deployment disabled | The website is not live. Shopify spending cannot fix this hosting blocker. |
| Latest Vercel Preview | `fix-signature-hoodie-staging-preview@425f50b`; deployment state READY but public request returns 402 | Not the current candidate and not usable for review until Vercel access is restored. |
| Emergent dashboard | Authenticated; project card `Premium Commerce 8`, forked from `carlo-minimal`, job ID `c8d11765-3066-436d-8118-a3922c519218`, updated six days earlier | Likely source of the public concept assets. Actual project source/routes/preview remain uninspected pending navigation approval. |

## What the visual evidence says

### Production-aligned storefront

The historical `9e1f5c3` implementation established the approved presentation language: black full-height composition, restrained two-level navigation, oversized product-led headline, split media stage, and quiet interaction.

The local correction keeps that language but replaces unsafe historical behavior with truthful system copy and a release-derived call to action. The strongest existing browser evidence is:

- `test_reports/cp-production-visual-correction/browser/05-corrected-storefront-desktop.png`
- `test_reports/cp-production-visual-correction/browser/06-corrected-storefront-mobile.png`

The correction is intentionally not a finished selling storefront: the Hoodie is withheld, the board is labeled as visual-system reference only, and purchasing remains disabled.

### Editorial detour

Remote `main` descends from the change that replaced the product-led home with an empty editorial shell. The comparison screenshot is:

- `test_reports/cp-production-visual-correction/browser/02-editorial-detour-85b62e1-desktop.png`

That route direction does not satisfy the Product Owner's recovered objective and should not be the visual base.

### Emergent / ChatGPT-generated assets

The local code references 26 unique public images under the same Emergent job ID as `Premium Commerce 8`. All 26 were downloaded successfully and SHA-256 inventoried under:

- `reports/design-source-audit/emergent-public-assets/`
- `reports/design-source-audit/emergent-public-assets-manifest.json`
- `reports/design-source-audit/emergent-public-assets-contact-sheet.jpg`

They include logo explorations, brand boards, apparel assortment boards, generated runway/model imagery, and product collages. They are valuable as design-direction candidates. They are not acceptable production Hoodie photography because exact-product provenance, physical accuracy, approval, and release binding are absent.

### Architecture and prior model evidence

The recovered GPT archive and Character Platform Architecture materials consistently support the same four-lane system: Product/POD truth, Media truth, Shopify-backed Next.js commerce, and agentic orchestration. Contact sheet:

- `reports/design-source-audit/architecture-diagrams-contact-sheet.jpg`

An exhaustive image manifest currently covers 303 accessible images/diagrams across the CP workspace, recovered GPT archive, Character Platform FigJam exports, Organizer model-comparison evidence, and Codex architect output:

- `reports/design-source-audit/image-evidence-inventory.json`

The inventory includes hashes, dimensions, formats, source groups, and duplicate groups. It does not claim missing historical ChatGPT attachments were recovered; the recovered archive explicitly records those as unavailable.

## Goal-based decision

The approved goal is not simply “publish the prettiest homepage.” It is one Signature Hoodie proving the complete reusable POD-to-publish journey with a Vollebak-confidence original storefront, Shopify commerce truth, truthful rich media, and hard approval gates.

Decision:

1. **Runtime and code:** continue from local `93d8b39`.
2. **Visual baseline:** use historical `9e1f5c3` plus the corrected desktop/mobile evidence as the approved composition reference.
3. **Emergent:** mine it for design/source evidence only after the project is opened and audited. Do not replace the Next.js/Shopify architecture with Emergent or spend credits regenerating the site.
4. **Media:** use the 26 recovered/generated assets as an internal art-direction library only. Commission or bind exact-product media for the Hoodie release.
5. **Commerce:** keep Shopify as product/variant/price/cart/checkout truth. Do not let the existence of Shopify billing pressure trigger an unsafe release.

## Shortest safe route to a live result

There are two different meanings of “live,” and they must not be confused.

### Live brand/review site, no purchasing

1. Vercel account owner restores the disabled project/account service.
2. Product Owner authorizes pushing the temporary local correction branch.
3. Vercel creates a Preview from that branch; validate desktop/mobile, routes, headers, and fail-closed product state.
4. Open a focused PR to `main` and obtain explicit merge/production approval.
5. Merge only after Preview acceptance. Production then follows `main`.

This can restore a truthful brand site while products remain withheld.

### Live selling Hoodie

In addition to the steps above:

1. Verify read-only Shopify Storefront access and current Hoodie product/variant facts.
2. Bind an exact Apliiq fulfillment mapping and current availability evidence.
3. Produce/approve the required exact-product media set with provenance and fallbacks.
4. Apply an authorized Product Release Record transition.
5. Prove server-only variant resolution, Shopify cart creation, checkout redirect, controlled payment/order, POD handoff, tracking, support, and returns.

Until those are proven, a public site may be live, but the product must remain non-purchasable.

## Cost-control recommendation

The immediate nontechnical waste is paying Shopify while Vercel is disabled and no approved product can be sold. The technical response should be time-boxed:

- restore Vercel and obtain a working Preview first;
- audit the current Shopify plan and paid/usage-fee apps read-only;
- retain only the minimum path needed for the Hoodie proof: Shopify core/Storefront, the selected headless connector, Apliiq, one media workflow, Flow if it has a real job, and the required operations apps when their stage is reached;
- do not install, uninstall, downgrade, cancel, or accept plans without Product Owner approval and impact evidence.

If Vercel Preview cannot be restored promptly, pause further design-generation spend and make the Shopify subscription/app-cost decision explicitly rather than continuing disconnected recurring costs.

## Verification performed

`yarn verify` passed on 2026-08-02:

- ESLint: zero warnings/errors.
- Vitest: 32 files, 309 tests passed.
- Production dependency audit: 0 vulnerabilities across 193 packages.
- Next.js 15.5.21 production build: passed; 11 routes emitted.

Current external checks:

- Vercel project metadata: available through the authenticated connector; project `live: false`.
- Production source: `main@d172cfb`.
- `www.carlophillips.com`: HTTP 402.
- latest Preview: HTTP 402.
- Emergent public assets: 26/26 downloaded successfully.
- visual comparisons: storefront, Emergent asset, and architecture contact sheets generated and inspected.

## Remaining human action

To finish the Emergent code/design comparison, Boss must either:

- reply `Approve opening Premium Commerce 8 visibly`; or
- manually open that project in Emergent and reply `Emergent CP project open`.

No production deployment, push, merge, Shopify mutation, purchase, credit use, or paid-plan action was performed.
