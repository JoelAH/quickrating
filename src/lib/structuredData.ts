import { Review } from "./models/client/review";
import { User } from "./models/client/user";
import { TrialPageWithReviews } from "./models/client/trial-page";
import { TrialReview } from "./models/client/trial-review";

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QuickRating',
    url: 'https://quickrating.page',
    logo: 'https://quickrating.page/star.png',
    description: 'Review management platform for small businesses and online entrepreneurs. Collect and showcase customer reviews with custom landing pages.',
    sameAs: [
      // Add social media URLs when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English'
    }
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QuickRating',
    url: 'https://quickrating.page',
    description: 'Collect and display customer reviews for your small business',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://quickrating.page/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QuickRating',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Basic Plan',
        description: '3 reviews, auto-publish, customized page'
      },
      {
        '@type': 'Offer',
        price: '7',
        priceCurrency: 'USD',
        name: 'Standard Plan',
        description: 'Unlimited reviews, moderation, no branding'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150'
    }
  };
}

export function generateLocalBusinessSchema(page: User | TrialPageWithReviews) {
  const reviews = page.reviews || [];
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
    : 0;

  // Determine the correct URL based on page type
  const pageUrl = 'customLink' in page 
    ? `https://quickrating.page/${page.customLink}`
    : `https://quickrating.page/${'username' in page ? page.username : ''}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: page.businessName,
    image: page.imageUrl,
    description: page.greeting || `Customer reviews for ${page.businessName}`,
    url: pageUrl,
    ...(avgRating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1'
      }
    })
  };
}

export function generateReviewSchema(review: Review | TrialReview, businessName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: businessName
    },
    author: {
      '@type': 'Person',
      name: review.reviewer.name
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating || 5,
      bestRating: '5',
      worstRating: '1'
    },
    reviewBody: review.comment,
    datePublished: review.createdAt
  };
}

export function generateBlogPostingSchema(blog: {
  title: string;
  subTitle: string;
  slug: string;
  content: string;
  date: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.subTitle,
    url: `https://quickrating.page/blog/${blog.slug}`,
    datePublished: blog.date,
    dateModified: blog.date,
    author: {
      '@type': 'Organization',
      name: 'QuickRating'
    },
    publisher: {
      '@type': 'Organization',
      name: 'QuickRating',
      logo: {
        '@type': 'ImageObject',
        url: 'https://quickrating.page/star.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://quickrating.page/blog/${blog.slug}`
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
