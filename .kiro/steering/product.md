---
inclusion: always
---

# Product Overview

QuickRating is a review management platform for small businesses and online entrepreneurs (especially Instagram businesses) who need social proof but don't have a website.

## Core Features

- Custom landing pages for displaying customer reviews (quickrating.page/businessName)
- Review collection and management system
- Customizable branding (colors, images, business info)
- Two-tier pricing: Free (3 reviews, auto-publish) and Standard ($7/month, unlimited reviews with moderation)
- Contact information display (social media links, phone, address, etc.)

## Key User Flows

1. Sign up → Setup custom link → Customize page → Share link to collect reviews
2. Customers submit reviews via the custom link
3. Business owners manage reviews in dashboard (publish/unpublish for paid tier)
4. Public-facing review pages showcase approved reviews

## Authentication & Authorization

- Firebase Authentication for user management
- Server-side session validation using JWT tokens
- Subscription-based feature gating (free vs paid tier)
