import { blogs } from '@/lib/util';
import dbConnect from '@/lib/db/db';
import UserModel from '@/lib/models/server/user';
import type { MetadataRoute } from 'next';

export const revalidate = 3600;
const origin = 'https://quickrating.page';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles: MetadataRoute.Sitemap = [];
  // Query the deployment's own database rather than its production HTTP API.
  if (process.env.DB_URI) {
    try {
      await dbConnect();
      const users = await UserModel.find({ deletedAt: { $exists: false }, customLink: { $type: 'string', $ne: '' } })
        .select({ customLink: 1, updatedAt: 1 }).lean();
      for (const user of users) {
        const date = user.updatedAt ? new Date(user.updatedAt) : undefined;
        profiles.push({
          url: `${origin}/${encodeURIComponent(user.customLink)}`,
          ...(date && !Number.isNaN(date.getTime()) ? { lastModified: date } : {}),
          changeFrequency: 'monthly', priority: 0.4,
        });
      }
    } catch {
      console.error('Sitemap: could not load business pages.');
    }
  }
  return [
    { url: origin, changeFrequency: 'monthly', priority: 1 },
    { url: `${origin}/landing/travel-agents`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/blog`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${origin}/legal/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${origin}/legal/terms`, changeFrequency: 'yearly', priority: 0.2 },
    ...blogs.map(blog => ({ url: `${origin}/blog/${blog.slug}`, lastModified: new Date(blog.date), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...profiles,
  ];
}
