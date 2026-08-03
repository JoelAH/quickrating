import { Container, Grid, Chip, Button } from "@mui/material";
import Image from 'next/image';
import Link from "next/link";
import classes from './blog.module.scss';
import { blogs, formatDate } from "@/lib/util";
import { ArrowBack } from "@mui/icons-material";
import { generateBlogPostingSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import { Metadata } from "next";

export async function generateStaticParams() {
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = blogs.find(blog => blog.slug === params.slug);
    
    if (!article) {
        return {
            title: "Article Not Found | QuickRating",
            description: "This blog post could not be found."
        };
    }
    
    // Extract first 160 chars of content for description if subTitle is short
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
    const contentPreview = stripHtml(article.content).substring(0, 160);
    const description = article.subTitle.length > 50 ? article.subTitle : contentPreview;
    
    return {
        title: `${article.title} | QuickRating Blog`,
        description,
        keywords: `customer reviews, ${article.title.toLowerCase()}, small business tips, review management`,
        openGraph: {
            title: article.title,
            description: article.subTitle,
            url: `https://quickrating.page/blog/${params.slug}`,
            siteName: "QuickRating",
            type: "article",
            publishedTime: article.date,
            authors: ["QuickRating"],
            images: [{
                url: "https://quickrating.page/star.png",
                width: 512,
                height: 512,
                alt: article.title
            }]
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.subTitle,
            creator: "@QuickRating"
        },
        alternates: {
            canonical: `https://quickrating.page/blog/${params.slug}`
        }
    };
}

export default function Blog({ params }: { params: { slug: string } }) {
    const article = blogs.find(blog => blog.slug === params.slug);

    const blogSchema = article ? generateBlogPostingSchema(article) : null;
    const breadcrumbSchema = article ? generateBreadcrumbSchema([
        { name: 'Home', url: 'https://quickrating.page' },
        { name: 'Blog', url: 'https://quickrating.page/blog' },
        { name: article.title, url: `https://quickrating.page/blog/${params.slug}` }
    ]) : null;

    return (
        <>
            {
                !!article ? (
                    <div className={classes.articlePage}>
                        {blogSchema && (
                            <script 
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
                            />
                        )}
                        {breadcrumbSchema && (
                            <script 
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                            />
                        )}
                        <Container maxWidth="md">
                            <Button
                                component={Link}
                                href="/blog"
                                startIcon={<ArrowBack />}
                                className={classes.backButton}
                            >
                                Back to Blog
                            </Button>
                            
                            <article className={classes.article}>
                                <header className={classes.articleHeader}>
                                    <Chip 
                                        label={formatDate(article.date)} 
                                        className={classes.dateChip}
                                    />
                                    <h1 className={classes.articleTitle}>{article.title}</h1>
                                    <p className={classes.articleSubtitle}>{article.subTitle}</p>
                                </header>
                                
                                <div 
                                    className={classes.articleContent}
                                    dangerouslySetInnerHTML={{__html: article.content}}
                                />
                                
                                <footer className={classes.articleFooter}>
                                    <div className={classes.cta}>
                                        <h3>Ready to collect reviews for your business?</h3>
                                        <p>Join thousands of businesses using QuickRating to build trust and grow.</p>
                                        <Button 
                                            variant="contained" 
                                            size="large"
                                            component={Link}
                                            href="/"
                                            className={classes.ctaButton}
                                        >
                                            Get Started Free
                                        </Button>
                                    </div>
                                </footer>
                            </article>
                        </Container>
                    </div>
                ) : (
                    <Grid container spacing={2} className={classes.notFound}>
                        <Grid item xs={12}>
                            <Image
                                src={'/sad.png'}
                                alt={'not found'}
                                width={80}
                                height={80}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h1>Sorry, we could not find that page</h1>
                            <h3>Check that you have the right link</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                component={Link} 
                                href="/blog"
                            >
                                View All Blog Posts
                            </Button>
                        </Grid>
                    </Grid>
                )
            }
        </>
    )
}