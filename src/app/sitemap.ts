import { blogs } from '@/lib/util';
import type { MetadataRoute } from 'next';

type changeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let maps: { url: string, lastModified: Date, changeFrequency: changeFrequency, priority: number }[] = [];

    try {
        const res = await fetch('https://quickrating.page/api/get-all-users', {
            method: "POST",
            body: JSON.stringify({
                key: "next"
            })
        })
        if (res.ok) {
            const profiles = await res.json();
            if (profiles?.length) {
                maps = profiles.map((p: any) => {
                    return {
                        url: `https://quickrating.page/${p.customLink}`,
                        lastModified: new Date(p.updatedAt),
                        changeFrequency: 'monthly' as changeFrequency,
                        priority: 0.2
                    }
                })
            }
        }
    }
    catch (e) {
        console.log('sitemap error', JSON.stringify(e));
     }

     const blogMaps = blogs.map((blog: any) => {
        return {
            url: `https://quickrating.page/blog/${blog.slug}`,
            lastModified: new Date(blog.date),
            changeFrequency: 'monthly' as changeFrequency,
            priority: 0.7
        }
    });
    maps = [...maps, ...blogMaps];

    return [
        {
            url: 'https://quickrating.page',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://quickrating.page/blog',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://quickrating.page/auth/signup',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://quickrating.page/auth/login',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: 'https://quickrating.page/legal/privacy',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: 'https://quickrating.page/legal/terms',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...maps
    ]
}