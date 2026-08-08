# CP runway Production launch checkpoint

Date: 2026-08-08
Evidence branch: `codex/cp-runway-production-evidence`
Canonical merge: `d874e208397108b181cd71a6a4cd324e65419b0d`
Production deployment: `dpl_8Re2EpSmgeT5yoreyHy39edFEiuw`

## Deployment result

- Canonical PR #7 merged successfully into `main` as `d874e20` under the Product Owner's instruction to final-check and launch.
- Vercel built and deployed that exact detached merge commit with target `production`.
- Deployment URL: `https://carlophillips-site-kvoc7gzb2-adityas-projects-261b17a9.vercel.app`.
- Vercel Production alias: `https://carlophillips.com`.
- Apex returns HTTP 308 to `https://www.carlophillips.com/`; `www` returns HTTP 200 with the campaign asset preloaded.

## Production browser gate

Desktop 1440×1000 and mobile 390×844 both render the approved coastal campaign with `At the edge of life.`, decoded imagery, zero broken images, zero horizontal overflow, no runtime-error text, and no console errors.

The next panel does not render the Signature Hoodie. It truthfully displays the safe `Form. Function.` fallback; Hoodies, Shirts, Outerwear, Bottoms, and Accessories are all disabled. This is not the accepted end state.

## Root cause

Vercel environment inventory shows six encrypted variables scoped to Preview and none scoped to Production. Preview therefore passes the full campaign → Hoodie → categories/PDP/Shopify gate; Production intentionally withholds the product.

The six variable names are:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_TOKEN`
- `NEXT_PUBLIC_COMMERCE_ENVIRONMENT`
- `COMMERCE_DATA_MODE`
- `NEXT_PUBLIC_SHOW_PRODUCTS`
- `SHOPIFY_CART_UI_ENABLED`

No value was retrieved or exposed. A secure pull was rejected because the prior authorization covered Preview only. Product Owner must explicitly authorize the new Production scope after being informed that it makes the Hoodie and purchase boundary public.

## Visual evidence

- `test_reports/cp-runway-production-launch-2026-08-08/home-desktop.png`
- `test_reports/cp-runway-production-launch-2026-08-08/home-desktop-product-scroll.png`
- `test_reports/cp-runway-production-launch-2026-08-08/home-mobile.png`
- `test_reports/cp-runway-production-launch-2026-08-08/home-mobile-product-scroll.png`

## Resume point

On exact Product Owner authorization, copy the six existing encrypted Preview values to Production without printing them, redeploy canonical `main`, repeat desktop/mobile/PDP/purchase-boundary verification, and stop before checkout payment/order. Preserve rollback to the immediately preceding Production deployment if any gate fails.
