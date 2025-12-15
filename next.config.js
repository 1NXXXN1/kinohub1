/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: '**.kinopoisk.ru' },
      { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
      { protocol: 'https', hostname: 'kinopoiskapiunofficial.tech' }
    ]
  }
};
module.exports = nextConfig;
