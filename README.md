# QuickRating

A review management platform for small businesses and online entrepreneurs who need social proof but don't have a website.

## Features

- **Custom Review Pages**: Create personalized landing pages at `quickrating.page/[username]`
- **Trial Pages**: Test the platform without signing up (3 reviews, 14-day expiration)
- **Review Management**: Collect and manage customer reviews with email verification
- **Customizable Branding**: Colors, images, business info, and contact details
- **Two-Tier Pricing**: Free (15 reviews, auto-publish) and Standard ($7/month, unlimited reviews with moderation)

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB database
- Firebase project (Authentication + Storage)
- Email service API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and configure your environment variables (see Configuration section below)

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Lato, a custom Google Font.

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

#### Required Variables

- **Firebase Configuration** (Client-side):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` — Analytics web-stream ID (`G-…`); legacy `NEXT_PUBLIC_MEASUREMENT_ID` also works
  - `NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG` — set to `true` only when testing with Analytics DebugView

- **Database**:
  - `DB_URI` - MongoDB connection string

- **Email Service**:
  - `EMAIL_API_KEY` - API key for email service

- **Application**:
  - `DASHBOARD_URL` - URL for dashboard redirects (e.g., `http://localhost:3000/main/dashboard`)
  - `TEST_MODE` - Set to `true` to disable certain features during testing (default: `false`)

- **Payment (LemonSqueezy)**:
  - `LS_API_KEY` - LemonSqueezy API key
  - `LS_STORE_ID` - Your store ID
  - `LS_PRODUCT_ID` - Your product ID
  - `LS_VARIANT_STANDARD_ID` - Standard subscription variant ID
  - `LS_WEBHOOK_SIG` - Webhook signature for verification
  - `LS_REDIRECT_URL` - Payment redirect URL

- **Firebase Admin SDK**:
  - `FIREBASE_SERVICE_ACCOUNT_KEY` - JSON string containing service account credentials

### Trial Pages Configuration

Trial pages have the following default settings (hardcoded in the application):

- **Expiration Period**: 14 days from creation
- **Maximum Reviews**: 3 reviews per trial page
- **IP Rate Limiting**: 3 trial page creation attempts per 24 hours per IP address
- **Claim Token Expiry**: 14 days from creation

These values are configured in the following files:
- Expiration days: `src/app/actions/createTrialPage.ts` (line 115, 119)
- Review limit: `src/app/actions/sendTrialReviewCode.ts` (line 66)
- Rate limit: `src/lib/db/ip-rate-limit.ts` (line 29, 44)

To customize these values, modify the constants directly in the code.

## Trial Pages Feature

Trial pages allow users to test QuickRating without creating an account.

### How It Works

1. **Create Trial Page**: Visit `/try/setup` to create a trial page with:
   - Username (required)
   - Email (optional, for claiming later)
   - Business name and customization options

2. **Receive Credentials**: Get a temporary password and trial page URL
   - If email provided, receive a claim link via email

3. **Share & Collect Reviews**: Share your trial page URL to collect up to 3 reviews
   - Reviews are auto-published (no moderation)
   - Trial page expires after 14 days

4. **Claim Your Page**: Convert trial to full account via claim link
   - Create Firebase account (email/password or Google)
   - All reviews migrate to your new account
   - Unlock unlimited reviews and moderation features

### Trial Page Limitations

- Maximum 3 reviews
- 14-day expiration
- Auto-publish only (no review moderation)
- No dashboard access
- IP rate limiting (3 trial pages per 24 hours)

### Claiming Process

When claiming a trial page:
1. Visit `/claim/[token]` from the email link
2. Choose authentication method (email/password or Google)
3. Data automatically migrates:
   - TrialPage → User account
   - TrialReview → Review records
   - All customization settings preserved
4. Original trial page marked as claimed (not deleted)

## Development

### Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **UI**: Material-UI v5 with SCSS Modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **Payments**: LemonSqueezy

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [username]/        # Public review pages
│   ├── actions/           # Server Actions
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── claim/             # Trial page claim flow
│   ├── main/              # Protected dashboard
│   └── try/               # Trial page creation
├── components/            # React components
├── lib/
│   ├── db/               # Database access layer
│   ├── firebase/         # Firebase configuration
│   ├── models/           # TypeScript types & Mongoose schemas
│   └── services/         # Business logic
└── public/               # Static assets
```

### Common Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Make sure to configure all environment variables in your deployment platform before deploying.

## Firebase Analytics

Firebase Analytics initializes from the root layout, including public landing pages,
business pages, and the dashboard. It loads only in supported browsers and only
when a valid measurement ID is configured. Initialization is shared across mounts.

1. Enable Google Analytics for the Firebase project and register its web data stream.
2. Set `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` to that stream's `G-…` ID in your
   hosting environment. Existing `NEXT_PUBLIC_MEASUREMENT_ID` values remain supported.
3. Rebuild and redeploy: Next.js embeds public environment variables at build time.
4. In the stream's Enhanced Measurement settings, keep **Page views** and
   **Page changes based on browser history events** enabled so navigation through
   Next.js links is tracked. The app uses the SDK's automatic page-view collection;
   it does not also emit manual page views.

Localhost, loopback, and development runs are excluded by default. To test locally,
use your real Firebase web configuration and set
`NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG=true`. Check Firebase Analytics DebugView,
then turn the flag off before publishing. Normal production visits can be checked
in Google Analytics Realtime. Blocked analytics never prevents the app from loading.
