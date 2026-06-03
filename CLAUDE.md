# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Two Separate Projects

This repo contains **two independent codebases**:

| Directory | What it is |
|---|---|
| `/` (root) | React 19 frontend — Create React App |
| `car-management/` | Node.js/Express backend — see `car-management/CLAUDE.md` |

---

## Frontend Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build → build/
npm test           # Jest/Testing Library in watch mode
```

**Environment variable**: `REACT_APP_API_URL=http://localhost:5000` in `.env`.

> ⚠️ `src/api/api.js` currently uses `import.meta.env.VITE_API_URL` (Vite syntax) but this is a CRA project — the correct key is `process.env.REACT_APP_API_URL`. The fallback hardcodes `localhost:5000`.

---

## Architecture

### Tech Stack
- **React 19**, React Router v7, Axios
- **Plain CSS** — no Tailwind, no CSS-in-JS, no CSS Modules
- **No state management library** — React Context only

### Routing & Layout (`src/App.jsx`)
- `ThemeContext` (dark/light) and `LanguageProvider` wrap the entire tree
- `AppLayout` conditionally hides `<Header>` on auth routes and `<Footer>` on auth + admin routes
- Admin routes (`/admin/*`) are wrapped in `<ProtectedRoute allowedRoles={["admin","employee"]}>`
- `/admin/roles` is admin-only

### Design System (`src/styles/tokens.css`)
Single source of truth for all CSS custom properties — imported at the top of `index.css`. **Always use tokens instead of hardcoded values.**

Key token groups: colors (`--color-red`, `--color-blue`, `--color-success`, `--color-warning`, social brand colors), backgrounds (`--bg-page`, `--bg-surface`, `--bg-surface-2`), typography (`--font`, `--font-size-*`), spacing (`--space-*`, `--section-py`), shadows (`--shadow-sm/md/lg`), animation (`--duration-fast/normal/slow`, `--ease-standard`), and `--focus-ring`.

Dark mode is toggled via `body.dark` class. All dark overrides live in `body.dark { }` blocks, either in `tokens.css` (for tokens) or co-located in the component's CSS file.

### API Layer (`src/api/`)
All files import from `src/api/api.js` (Axios instance with `withCredentials: true` for session cookies). Each file is grouped by domain: `showroom.api.js`, `soldhistory.api.js`, `auth.api.js`, `cars.api.js`, `contact.api.js`, etc.

### Auth (`src/context/AuthContext.jsx`)
- `useAuth()` returns `{ user, loading, login, logout }`
- `user.role` is `"admin"` or `"employee"` for staff; `null` for unauthenticated
- `isAdmin` pattern: `user?.role === "admin" || user?.role === "employee"`

### Internationalization (`src/context/LanguageContext.jsx`)
- `useLanguage()` returns `{ language, changeLanguage, t }`
- All user-facing strings go through `t("key")` — keys are defined inline in the context file
- Supported: `EN`, `MM`, `TH`

### Feature Structure (`src/features/`)
```
features/
  admin/        # Admin pages, components, hooks, services, styles
  auth/         # Login, signup, password reset pages + authService
  user/         # Profile, Contact pages + UserStyles.css
```

Admin-specific CSS lives in `src/features/admin/styles/` (6 files). The hook `useAdminCars(type)` in `src/features/admin/hooks/useAdminCars.js` is the central data layer for all admin car listing pages — it fetches, normalizes, filters by tab, and exposes `markAsStatus` / `clearCar` mutations.

### Home Page Sections (`src/section/`)
Each section is a self-contained component + CSS file. Order in `App.jsx` `Home()`: Hero → Deals → BrandList → CarTypes → EasyRental → WhyChooseUs → Testimonials → AboutUs → Team.

### Shared Components (`src/components/`)
- `Header.jsx` — nav, dark mode toggle, language picker, side menu
- `CarCard.jsx` — used in Showroom; root element is `<button type="button">`
- `Spinner.jsx` — `size` prop: `"sm"` | `"md"` | `"lg"`; replaces all text loading states
- `Toast.jsx` — `{ message, type: "success"|"error"|"info", onClose }`; auto-dismisses in 4s; replaces `alert()`

### Sold Cars Logic
- **Showroom buy listing** (`src/pages/Showroom.jsx`): filters `status === "sold"` out in `filteredCars` useMemo **unless** `isAdmin`
- **Sold History** (`src/section/SoldHistory.jsx`): fetches `/cars?price_min=1` then filters client-side for `status === "sold"`; stats from `/cars/sold/stats` are fetched independently so a 404 doesn't break the cars list
