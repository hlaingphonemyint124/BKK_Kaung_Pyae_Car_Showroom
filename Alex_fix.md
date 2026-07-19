# Fix: Consistent sale/rent classification via `listing_type`

**Date:** 2026-07-18
**Reference:** [Problem.md](Problem.md)

## What was the problem

Whether a car appeared as "for sale" or "for rent" was decided inconsistently:

1. **Dead `"rental"` checks** — a few files compared `listing_type` against `"rental"`, but the backend (and the admin pages that write the field) only ever use `"rent"` or `"sale"`. Those checks never matched real data.
2. **Price-field inference** — the main public pages (Showroom, CarDetail) and the central admin hook ignored `listing_type` entirely and guessed the type from whether `sale_price` or `rent_price_per_day` was populated. A stray price value on a car could misclassify it even though `listing_type` in the database was correct.

## What was done

A single rule was applied everywhere:

> **Check `listing_type` first (`"sale"` / `"rent"`). Fall back to price-field inference only when `listing_type` is missing (`null`/`undefined`).**

The `null` fallback is kept intentionally so older records without a `listing_type` still display correctly.

### 1. Replaced dead `"rental"` value with `"rent"`

| File | Change |
|---|---|
| [src/section/Deals.jsx](src/section/Deals.jsx) | `expectedType` for the rent tab changed from `"rental"` to `"rent"`, so the Most Rented tab now actually matches rent-listed cars instead of relying on the `listing_type == null` fallback. |
| [src/section/EasyRental.jsx](src/section/EasyRental.jsx) | Fleet filter now checks `listing_type === "rent"` (was `"rental"`); price fallback unchanged. |
| [src/pages/RentalHistoryPage.jsx](src/pages/RentalHistoryPage.jsx) | Removed the dead `listing_type === "rental"` branch from `isRentalCar`; the `"rent"` check and price fallback remain. |

### 2. Made `listing_type` the primary classification

| File | Change |
|---|---|
| [src/pages/Showroom.jsx](src/pages/Showroom.jsx) | `matchesListing` in the `filteredCars` memo now checks `listing_type === "sale"` (buy mode) / `listing_type === "rent"` (rent mode) first, falling back to the old `sale_price` / `rent_price_per_day` check only when `listing_type` is null. |
| [src/pages/CarDetail.jsx](src/pages/CarDetail.jsx) | `isRentalCar` now checks `listing_type === "rent"` first, with the old price-based inference as the null fallback. This decides which related-cars list (rent vs sale) is fetched. |
| [src/features/admin/hooks/useAdminCars.js](src/features/admin/hooks/useAdminCars.js) | Two edits: (a) the car-mapping step previously **dropped** `listing_type` — it is now preserved on the mapped object (`listing_type: car.listing_type ?? null`); (b) the buy/rental type filter in `filteredCars` checks `listing_type` first with the price fields as null fallback. The hook's `type` parameter values (`"buy"` / `"rental"`) are route/mode names, not `listing_type` values, and were left unchanged. |

## Files touched

- `src/section/Deals.jsx`
- `src/section/EasyRental.jsx`
- `src/pages/RentalHistoryPage.jsx`
- `src/pages/Showroom.jsx`
- `src/pages/CarDetail.jsx`
- `src/features/admin/hooks/useAdminCars.js`

## Files deliberately not changed

- `src/section/SoldHistory.jsx` — already checks `listing_type === "sale"` correctly.
- `src/api/showroom.api.js`, `src/api/deals.api.js`, `src/api/soldhistory.api.js` — already send the correct `"sale"` / `"rent"` query params.
- `src/features/admin/pages/AdminBuyDetailPage.jsx`, `AdminRentalDetailPage.jsx` — the source of truth; they already write `listing_type` correctly.

