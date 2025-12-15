# Kino Minimal (Vercel-ready, pnpm)
Minimal Next.js (App Router) kino sayti. Kinopoisk Unofficial API va ixtiyoriy TMDB bilan ishlaydi. Tailwind va framer-motion bilan sodda animatsiyalar.

## O'rnatish (lokal)
```bash
pnpm i
cp .env.example .env.local
# .env.local ichiga API kalitlarini kiriting
pnpm dev
```

## Vercel
- Zipni Vercel'ga yuklang (New Project -> Import... -> Upload).
- Environment Variables bo'limiga quyini kiriting:
  - KINOPOISK_API_BASE = https://kinopoiskapiunofficial.tech
  - KINOPOISK_API_KEY = <kalitingiz>
  - (ixtiyoriy) TMDB_API_BASE = https://api.themoviedb.org/3
  - (ixtiyoriy) TMDB_API_KEY = <kalit>
- Build Command: *avtomatik* (`pnpm build`) — `vercel.json` ham bor.
- Output dir: `.next`

## Bo'limlar
- /films, /serials, /multfilms, /favorites
- /watch/[id] — pleyer: https://api.linktodo.ws/embed/kp/ID?host=kinobd.net

## Eslatma
- Favorites localStorage yordamida ishlaydi.
- TMDB bo'lmasa ham sayt ishlaydi (faqat Kinopoisk).
