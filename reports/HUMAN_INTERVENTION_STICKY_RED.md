# HUMAN INTERVENTION REQUIRED — AUTHORIZE PRODUCTION STOREFRONT VARIABLES

Updated: 2026-08-08

## Exact action

Reply in the active Codex task with this exact authorization:

`Approve copying the six existing encrypted CARLOPHILLIPS Vercel Preview variables to Production and redeploying canonical main. Do not reveal values or place an order.`

No browser screen needs to be opened. The currently live campaign can be viewed at:

`https://www.carlophillips.com`

## Why this is required

Canonical main and the coastal campaign are already deployed. The final Production browser gate found that Vercel Production has no storefront environment variables, while Preview has six encrypted variables. Consequently Production safely withholds the Hoodie and shows the fallback panel; Preview shows the intended Hoodie runway, category state, PDP facts, and Shopify purchase boundary.

The requested authorization newly scopes these existing settings to Production:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_TOKEN`
- `NEXT_PUBLIC_COMMERCE_ENVIRONMENT`
- `COMMERCE_DATA_MODE`
- `NEXT_PUBLIC_SHOW_PRODUCTS`
- `SHOPIFY_CART_UI_ENABLED`

No value has been retrieved, printed, documented, or committed.

## Risk and cost

- No purchase, billing change, paid plan, order, or provider action is involved.
- The authorization will make the active Signature Hoodie and its Shopify purchase boundary public on Production.
- It does not submit checkout, payment, or an order.
- The deployment can be rolled back through the preceding Vercel Production deployment if the post-deploy gate fails.

## Resume point

After the exact reply, transfer the six existing encrypted values without displaying them, redeploy canonical `main`, verify desktop/mobile landing → Hoodie → categories, verify the PDP and trusted Shopify purchase boundary, stop before payment/order, and record the new deployment plus rollback evidence.
