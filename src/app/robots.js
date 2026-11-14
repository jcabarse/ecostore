export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/checkout', '/api/'], // Hides private areas from Google
    },
    sitemap: 'https://ecostore-rouge.vercel.app/sitemap.xml',
  };
}