# KinoHub — Netlify Final (Heart + Title)
- Navbar: faqat Saralanganlar
- Home: TOP 10 film, TOP 10 serial, TOP 10 multfilm (poster)
- Heart (🤍 → ❤️) animatsiyasi: Framer Motion
- Watch title: "Film nomi (yil) | NX" + description
- API key rotatsiyasi (NEXT_PUBLIC_KINOPOISK_API_KEYS) + TMDB fallback
- Netlify: `netlify.toml` (npm build)

## Environment (Netlify)
NEXT_PUBLIC_KINOPOISK_API_BASE=https://kinopoiskapiunofficial.tech
NEXT_PUBLIC_KINOPOISK_API_KEYS=key1,key2,key3
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key

## Build
npm install --no-audit --no-fund && npm run build
Publish: .next
