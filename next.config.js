/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'kinopoiskapiunofficial.tech' },
      { protocol: 'https', hostname: 'kinopoiskapiunofficial.tech', pathname: '/**' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: '**.kinopoisk.ru' }
    ]
  }
};
module.exports = nextConfig;
