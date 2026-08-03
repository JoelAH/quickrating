import { Metadata } from 'next';
import { AppBar, Box, Button, Grid, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import CONSTANTS from '@/lib/constants';
import classes from './page.module.scss';

export const metadata: Metadata = {
  title: 'QuickRating for Travel Agents - Close More Bookings with Reviews',
  description: 'Independent travel agents: Build trust instantly with a personal review page. Share one link to prove credibility and close more cruise, honeymoon, and group trip bookings.',
  keywords: 'travel agent reviews, independent travel agent, travel advisor reviews, cruise reviews, honeymoon reviews, travel agent credibility, Instagram travel agent, WhatsApp travel sales',
  openGraph: {
    title: 'QuickRating for Travel Agents - Close More Bookings',
    description: 'Build trust with leads using a personal review page. Perfect for independent travel agents selling via Instagram and WhatsApp.',
    url: 'https://quickrating.page/landing/travel-agents',
    siteName: 'QuickRating',
    type: 'website',
    images: [{
      url: 'https://quickrating.page/travel-agents-og.png',
      width: 1200,
      height: 630,
      alt: 'QuickRating for Travel Agents'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickRating for Travel Agents',
    description: 'Close more bookings with a personal review page',
    creator: '@QuickRating',
    images: ['https://quickrating.page/travel-agents-og.png']
  },
  alternates: {
    canonical: 'https://quickrating.page/landing/travel-agents'
  }
};

export default function TravelAgentsLanding() {
  // Structured data for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "QuickRating for Travel Agents",
    "description": "Review management platform for independent travel agents",
    "url": "https://quickrating.page/landing/travel-agents",
    "audience": {
      "@type": "Audience",
      "audienceType": "Independent Travel Agents"
    },
    "provider": {
      "@type": "Organization",
      "name": "QuickRating",
      "url": "https://quickrating.page"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Box sx={{ flexGrow: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }} component="header">
        <AppBar position="static" color={'transparent'} sx={{ boxShadow: 'none' }} component="nav" role="navigation" aria-label="Main navigation">
          <Toolbar sx={{ padding: { xs: '0 16px', md: '0 24px' } }}>
            <Image src={'/star.png'} alt={'QuickRating logo'} width={40} height={40} priority />
            <Typography className={classes.brand} variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 1 }}>
              {CONSTANTS.appName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
              <Link href={'/auth/login'} passHref>
                <Button sx={{ color: 'black' }} aria-label="Log in to your account">Log In</Button>
              </Link>
              <Link href={'/auth/signup'} passHref>
                <Button variant="contained" color="info" sx={{ borderRadius: 10 }} aria-label="Sign up for free account">Sign Up Free</Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <main>
        {/* Hero Section */}
        <section className={classes.heroSection} aria-labelledby="hero-heading">
          <div className={classes.heroContent}>
            <h1 id="hero-heading" className={classes.heroHeadline}>
              Close more travel bookings with one trusted review link
            </h1>
            <p className={classes.heroSubheadline}>
              QuickRating gives independent travel agents a personal reviews page they can share with hesitant clients to prove credibility and close deals faster.
            </p>
            <div className={classes.heroButtons}>
              <Link href="/travelrs" passHref>
                <Button 
                  variant="contained" 
                  className={classes.heroPrimaryButton}
                  aria-label="View example travel agent review page"
                >
                  View example review page
                </Button>
              </Link>
              <Link href="/auth/signup" passHref>
                <Button 
                  variant="outlined" 
                  className={classes.heroSecondaryButton}
                  aria-label="Get free setup for your review page"
                >
                  Get free setup
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className={classes.problemSection} aria-labelledby="problem-heading">
          <div className={classes.problemContent}>
            <h2 id="problem-heading" className={classes.problemHeading}>
              New travel clients don&apos;t trust easily
            </h2>
            <ul className={classes.problemList} aria-label="Trust challenges for travel agents">
              <li className={classes.problemItem}>
                Leads ask &quot;Are you legit?&quot; before paying
              </li>
              <li className={classes.problemItem}>
                Your reviews are scattered across DMs, WhatsApp chats, and Facebook comments
              </li>
              <li className={classes.problemItem}>
                Screenshots look unprofessional and are easy to fake
              </li>
              <li className={classes.problemItem}>
                Google Reviews don&apos;t work well for independent agents
              </li>
            </ul>
          </div>
        </section>

        {/* Solution Section */}
        <section className={classes.solutionSection} aria-labelledby="solution-heading">
          <div className={classes.solutionContent}>
            <h2 id="solution-heading" className={classes.solutionHeading}>
              One page that proves you&apos;re a trusted travel agent
            </h2>
            <p className={classes.solutionDescription}>
              QuickRating gives you a clean, professional review page that you own and control. Share one simple link with leads to instantly build trust and credibility.
            </p>
            <ul className={classes.solutionBenefits} aria-label="QuickRating benefits">
              <li className={classes.solutionBenefit}>
                Public reviews page branded to you
              </li>
              <li className={classes.solutionBenefit}>
                Reviews tagged by trip type (cruise, group trip, honeymoon, etc.)
              </li>
              <li className={classes.solutionBenefit}>
                Easy to share on Instagram, WhatsApp, and email
              </li>
              <li className={classes.solutionBenefit}>
                You control your reviews — not a third-party platform
              </li>
            </ul>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={classes.howItWorksSection} aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className={classes.howItWorksHeading}>
            How It Works
          </h2>
          <Grid container spacing={4} className={classes.howItWorksGrid}>
            <Grid item xs={12} md={4}>
              <div className={classes.stepCard}>
                <div className={classes.stepIconContainer} aria-hidden="true">
                  <span className={classes.stepNumber}>1</span>
                </div>
                <h3 className={classes.stepTitle}>
                  Create your personal travel agent review page
                </h3>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.stepCard}>
                <div className={classes.stepIconContainer} aria-hidden="true">
                  <span className={classes.stepNumber}>2</span>
                </div>
                <h3 className={classes.stepTitle}>
                  Send your review link to past or recent clients
                </h3>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.stepCard}>
                <div className={classes.stepIconContainer} aria-hidden="true">
                  <span className={classes.stepNumber}>3</span>
                </div>
                <h3 className={classes.stepTitle}>
                  Share your review page with new leads to build trust and close bookings
                </h3>
              </div>
            </Grid>
          </Grid>
        </section>

        {/* Use Cases Section */}
        <section className={classes.useCasesSection} aria-labelledby="use-cases-heading">
          <div className={classes.useCasesContent}>
            <h2 id="use-cases-heading" className={classes.useCasesHeading}>
              How travel agents use QuickRating
            </h2>
            <ul className={classes.useCasesList} aria-label="Use cases for travel agents">
              <li className={classes.useCaseItem}>
                Send your review link right after a travel inquiry
              </li>
              <li className={classes.useCaseItem}>
                Add it to your Instagram bio
              </li>
              <li className={classes.useCaseItem}>
                Drop it into WhatsApp conversations
              </li>
              <li className={classes.useCaseItem}>
                Include it in follow-up emails before payment
              </li>
            </ul>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={classes.finalCTASection} aria-labelledby="final-cta-heading">
          <div className={classes.finalCTAContent}>
            <h2 id="final-cta-heading" className={classes.finalCTAHeading}>
              Start closing more bookings today
            </h2>
            <Link href="/auth/signup" passHref>
              <Button 
                variant="contained" 
                className={classes.finalCTAButton}
                aria-label="Get your free review page"
              >
                Get your free review page
              </Button>
            </Link>
            <p className={classes.finalCTASubtext}>
              No credit card required • Free setup
            </p>
          </div>
        </section>
      </main>
      <footer role="contentinfo">
        <Grid container className={classes.legal}>
          <Grid xs={12} md={4}>
            &copy; {new Date().getFullYear()} {CONSTANTS.appName}
          </Grid>
          <Grid xs={12} md={4}>
            <Link href={'/legal/privacy'} aria-label="Read our privacy policy">
              Privacy Policy
            </Link>
          </Grid>
          <Grid xs={12} md={4}>
            <Link href={'/legal/terms'} aria-label="Read our terms and conditions">
              Terms &amp; Conditions
            </Link>
          </Grid>
        </Grid>
      </footer>
    </>
  );
}
