# KinoHub (Netlify Poster Fixed)
Next.js App Router kino sayti: TOP-100 filmlar va seriallar (poster bilan) + qidiruv.
Client-side fetch: Kinopoisk (multi-key fallback) va TMDB zaxira.

## Netlify Environment Variables
- NEXT_PUBLIC_KINOPOISK_API_BASE = https://kinopoiskapiunofficial.tech
- NEXT_PUBLIC_KINOPOISK_API_KEYS = key1,key2,key3
- NEXT_PUBLIC_TMDB_API_KEY = your_tmdb_key

## Build
- Netlify `netlify.toml` tayyor.
- Build: `npm install --no-audit --no-fund && npm run build`
- Publish: `.next`
