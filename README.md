# Kino Minimal (Final Vercel Version)
Optimized Next.js (App Router) cinema site using Kinopoisk Unofficial API with multi-key fallback and TMDB support.

## Deployment (Vercel)
1. Upload this ZIP to Vercel (New Project → Upload).
2. Add environment variables:
   - KINOPOISK_API_BASE = https://kinopoiskapiunofficial.tech
   - KINOPOISK_API_KEYS = key1,key2,key3
   - TMDB_API_BASE = https://api.themoviedb.org/3
   - TMDB_API_KEY = your_tmdb_key
3. Build will automatically run with `npm install && npm run build`.

## Features
- Minimal UI (Tailwind + framer-motion)
- Multi-API key Kinopoisk fallback (automatic rotation)
- TMDB enrichment fallback
- Favorites stored in localStorage
- Player: https://api.linktodo.ws/embed/kp/ID?host=kinobd.net
