import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/main/', '/auth/', '/claim/', '/try/', '/private/'] },
    sitemap: 'https://quickrating.page/sitemap.xml',
  };
}
