# VLearn Codelabs — frontend clone

Next.js (App Router) clone of the `codelabs.vlearn.dev/codelab` session-codelabs
listing. Frontend only: lab data is a static module, there is no backend or auth.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Layout

| Path | Purpose |
| --- | --- |
| [src/app/codelab/page.tsx](src/app/codelab/page.tsx) | The cloned listing page (`/` redirects here) |
| [src/app/codelab/\[slug\]/page.tsx](src/app/codelab/[slug]/page.tsx) | Placeholder lab page so card links resolve |
| [src/data/codelabs.ts](src/data/codelabs.ts) | Days and labs |
| [src/components/codelab-browser.tsx](src/components/codelab-browser.tsx) | Hero, search box, day sections |
| [src/components/lab-card.tsx](src/components/lab-card.tsx) | Lab card, badges, footer link |
| [src/components/site-header.tsx](src/components/site-header.tsx) | Header, nav, menus, theme/locale toggles |

## Notes

- Search matches title and goal, and ignores Vietnamese diacritics — `bai toan`
  finds `bài toán`.
- Dark mode is a `dark` class on `<html>`, set by an inline script in the root
  layout before first paint. `ThemeToggle` picks its icon in CSS rather than
  React state so the server HTML and the DOM can't disagree.
- Design tokens (brand blue, "Coming soon" amber, presentation violet, warm
  neutrals) live in `@theme` in [src/app/globals.css](src/app/globals.css).
- The source page is behind a login, so this was rebuilt from a screenshot.
  Day 1 and Day 2 match it; Day 3's cards were only partly visible in the
  screenshot and their copy is invented.
- The locale button toggles its own label only — there is no i18n content.
