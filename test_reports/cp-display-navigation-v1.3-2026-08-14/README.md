# CARLOPHILLIPS display and navigation v1.3 QA

Date: 2026-08-14  
Candidate branch: `codex/cp-display-navigation-v1-3`  
Base candidate: `f82733c` (v1.2.2)  
External mutations: none

## Delivered scope

- Removed the home-page bottom category rail.
- Added Hoodie, T-Shirts, Shirts, Outerwear, Bottoms, and Accessories to the hamburger menu.
- Kept only the real Signature Hoodie route active; unavailable categories remain visibly disabled.
- Added complete hamburger close behavior: close control, Escape, navigation selection, outside interaction, and responsive breakpoint transition.
- Added focus containment, focus return, scroll locking, and 44px minimum navigation controls.
- Enhanced the existing headless 12-view media viewer with a direct numbered index and a Product details handoff.
- Kept the 390px and compact viewer top row collision-free by placing Product details in the indexed rail below 640px; Motion study, the counter, and Close remain in the header. Tablet and desktop retain the full header handoff.
- Changed the mobile and tablet PDP media gallery to horizontal scroll-snap so product information follows one media viewport instead of four vertically stacked images.
- Replaced visible local-fixture provider captions with truthful `AI-assisted … · Draft review` and provider-neutral recorded-product wording. Internal provenance identifiers and release truth remain unchanged.
- Added no product, Shopify, POD, media, app, or Production mutations.

## Cross-verification decision

The attached Phase 4/5 guidance is only partly applicable to this headless storefront. Real POD product truth, approved media hierarchy, physical-sample-first review, and mobile interaction QA remain applicable. Shopify theme app blocks and a theme-editor product template do not control `carlophillips.com`; the custom storefront must consume approved exported assets directly. No 360, 3D, video, or AI-spin claim was added because no approved asset package proves those modalities yet.

## Automated gate

- `yarn verify`: passed
- ESLint: passed with zero warnings
- Vitest: 36 files, 348 tests passed
- Dependency audit: zero vulnerabilities
- Optimized Next.js production build: passed
- Browser verification: 4 viewports, 36 unique screenshots, 21 before/after comparisons
- Home, Shop, PDP, and Bag route health, reduced motion, menu, gallery, mobile touch, and responsive PDP checks: passed
- Viewer chrome: one visible Product details handoff, no overlap, no header overflow, single-line label, and all controls within the panel at every viewport
- Provider-neutral visible/accessibility copy, zero broken media, zero horizontal overflow, and zero console/page/request failures: passed
- Disabled-commerce proof at every viewport: zero forms, enabled submit controls, enabled selects, checkout links, `Continue to checkout` copy, and POST requests; `Purchasing disabled` remains visible on the PDP
- Browser console errors, page errors, and request failures: none

Machine-readable results are in `browser-verification.json`. Screenshots and comparisons are stored in the adjacent folders.

## Remaining staging gate

This evidence is local and fail-closed. The implementation still requires an immutable Vercel Preview built from the final commit, followed by the same Home/Shop/PDP/Bag matrix against that exact URL. No Preview deployment was created in this task.
