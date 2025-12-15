# Kino Minimal (Netlify Final Version)
Optimized Next.js cinema site using Kinopoisk Unofficial API with multi-key fallback and TMDB support.

## Deployment (Netlify)
1. Upload or connect this repository to Netlify.
2. Environment variables:
   - KINOPOISK_API_BASE = https://kinopoiskapiunofficial.tech
   - KINOPOISK_API_KEYS = key1,key2,key3
   - TMDB_API_BASE = https://api.themoviedb.org/3
   - TMDB_API_KEY = your_tmdb_key
3. Build command:
   npm install --no-audit --no-fund && npm run build
4. Publish directory:
   .next

TypeScript errors are ignored during build for stable deployment.
