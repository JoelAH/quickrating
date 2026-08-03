import { Container, Grid, Card, CardContent, CardActionArea, Chip } from "@mui/material";
import Link from "next/link";
import { blogs } from "@/lib/util";
import classes from './blog.module.scss';
import { formatDate } from "@/lib/util";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog - Customer Review Tips & Strategies | QuickRating",
    description: "Expert tips, insights, and success stories about customer reviews, building trust, and growing your small business online.",
    keywords: "customer reviews blog, review tips, small business marketing, social proof strategies, online reviews guide",
    openGraph: {
        title: "QuickRating Blog - Customer Review Tips & Strategies",
        description: "Expert tips, insights, and success stories about customer reviews and building trust for small businesses.",
        url: "https://quickrating.page/blog",
        siteName: "QuickRating",
        type: "website",
        images: [{
            url: "https://quickrating.page/star.png",
            width: 512,
            height: 512,
            alt: "QuickRating Blog"
        }]
    },
    twitter: {
        card: "summary_large_image",
        title: "QuickRating Blog - Customer Review Tips & Strategies",
        description: "Expert tips, insights, and success stories about customer reviews and building trust for small businesses.",
        creator: "@QuickRating"
    },
    alternates: {
        canonical: "https://quickrating.page/blog"
    }
};

export default function BlogList() {
    const sortedBlogs = [...blogs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const blogListSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'QuickRating Blog',
        description: 'Tips and insights about customer reviews for small businesses',
        url: 'https://quickrating.page/blog',
        publisher: {
            '@type': 'Organization',
            name: 'QuickRating',
            logo: {
                '@type': 'ImageObject',
                url: 'https://quickrating.page/star.png'
            }
        },
        blogPost: sortedBlogs.slice(0, 10).map(blog => ({
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.subTitle,
            url: `https://quickrating.page/blog/${blog.slug}`,
            datePublished: blog.date
        }))
    };

    return (
        <div className={classes.blogPage}>
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
            />
            <div className={classes.hero}>
                <Container maxWidth="lg">
                    <h1>QuickRating Blog</h1>
                    <p>Tips, insights, and success stories to help your business grow</p>
                </Container>
            </div>

            <Container maxWidth="lg" className={classes.blogContainer}>
                <Grid container spacing={4}>
                    {sortedBlogs.map((blog) => (
                        <Grid item xs={12} md={6} lg={4} key={blog.slug}>
                            <Card className={classes.blogCard} elevation={0}>
                                <CardActionArea 
                                    component={Link} 
                                    href={`/blog/${blog.slug}`}
                                    className={classes.cardAction}
                                >
                                    <CardContent>
                                        <div className={classes.cardHeader}>
                                            <Chip 
                                                label={formatDate(blog.date)} 
                                                size="small" 
                                                className={classes.dateChip}
                                            />
                                        </div>
                                        <h2 className={classes.cardTitle}>{blog.title}</h2>
                                        <p className={classes.cardSubtitle}>{blog.subTitle}</p>
                                        <span className={classes.readMore}>Read more →</span>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
}
