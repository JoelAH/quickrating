import CONSTANTS from '@/lib/constants';
import { AppBar, Box, Button, Grid, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import classes from './page.module.scss';
import LinkIcon from '@mui/icons-material/Link';
import BrushIcon from '@mui/icons-material/Brush';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { generateOrganizationSchema, generateWebsiteSchema, generateSoftwareApplicationSchema, generateFAQSchema } from '@/lib/structuredData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QuickRating - Customer Review Pages for Small Businesses',
  description: 'Collect and display customer reviews with custom landing pages. Perfect for Instagram businesses and online entrepreneurs. Free plan available.',
  keywords: 'customer reviews, review page, small business reviews, Instagram business, online reviews, social proof, testimonials',
  openGraph: {
    title: 'QuickRating - Customer Review Pages for Small Businesses',
    description: 'Collect and display customer reviews with custom landing pages. Perfect for Instagram businesses and online entrepreneurs.',
    url: 'https://quickrating.page',
    siteName: 'QuickRating',
    type: 'website',
    images: [{
      url: 'https://firebasestorage.googleapis.com/v0/b/pintratings.appspot.com/o/images%2FQR-Homepage.png?alt=media&token=70d3a00a-2992-4e9c-b5f0-98abe58e5d43',
      width: 1200,
      height: 630,
      alt: 'QuickRating - Review Management Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickRating - Customer Review Pages for Small Businesses',
    description: 'Collect and display customer reviews with custom landing pages. Perfect for Instagram businesses and online entrepreneurs.',
    creator: '@QuickRating',
    images: ['https://firebasestorage.googleapis.com/v0/b/pintratings.appspot.com/o/images%2FQR-Homepage.png?alt=media&token=70d3a00a-2992-4e9c-b5f0-98abe58e5d43']
  },
  alternates: {
    canonical: 'https://quickrating.page'
  }
};

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const softwareSchema = generateSoftwareApplicationSchema();
  
  const faqSchema = generateFAQSchema([
    {
      question: 'How does QuickRating work?',
      answer: 'QuickRating provides a custom review page where customers can leave reviews. You get a unique link (quickrating.page/yourname) to share with customers via social media, email, or text.'
    },
    {
      question: 'Is QuickRating free?',
      answer: 'Yes! We offer a free plan with 3 reviews and auto-publishing. Our Standard plan ($7/month) includes unlimited reviews, moderation, and no branding.'
    },
    {
      question: 'Do I need a website to use QuickRating?',
      answer: 'No! QuickRating is perfect for businesses without websites. Your review page serves as your online presence for collecting social proof.'
    },
    {
      question: 'Can I customize my review page?',
      answer: 'Absolutely! You can customize colors, add your logo, business information, and contact details to match your brand.'
    }
  ]);
  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Box sx={{ flexGrow: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <AppBar position="static" color={'transparent'} sx={{ boxShadow: 'none' }}>
          <Toolbar sx={{ padding: { xs: '0 16px', md: '0 24px' } }}>
            <Image src={'/star.png'} alt={'QuickRating'} width={40} height={40} priority />
            <Typography className={classes.brand} variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 1 }}>
              {CONSTANTS.appName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
              <Link href={'/auth/login'} passHref>
                <Button sx={{ color: 'black' }}>Log In</Button>
              </Link>
              <Link href={'/auth/signup'} passHref>
                <Button variant="contained" color="info" sx={{ borderRadius: 10 }}>Sign Up Free</Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <main>
        {/* Hero Section */}
        <Box className={classes.heroSection}>
          <Box className={classes.heroContent}>
            <h1 className={classes.heroHeadline}>
              Collect and Display Reviews — Even Without Google or Trustpilot
            </h1>
            <p className={classes.heroSubheadline}>
              QuickRating gives small online businesses a simple page where customers can leave real reviews you can proudly share.
            </p>
            <Box className={classes.heroButtons}>
              <Link href={'/auth/signup'} passHref>
                <Button
                  variant="contained"
                  className={classes.heroPrimaryButton}
                >
                  Create Your Free Review Page
                </Button>
              </Link>
              {/* <Link href={'/try/setup'} passHref>
                <Button
                  variant="outlined"
                  className={classes.heroSecondaryButton}
                >
                  Try Without Signing Up
                </Button>
              </Link> */}
            </Box>
          </Box>
        </Box>

        {/* Problem Section */}
        <Box className={classes.problemSection}>
          <Box className={classes.problemContent}>
            <p className={classes.problemStatement}>
              Most small online businesses don&apos;t have a place for customers to leave reviews.
            </p>
            <p className={classes.problemStatement}>
              Without reviews, new buyers hesitate — and sales slip away.
            </p>
            <p className={classes.problemStatement}>
              Collecting social proof shouldn&apos;t be this complicated.
            </p>
          </Box>
        </Box>

        {/* Guide Section */}
        <Box className={classes.guideSection}>
          <Box className={classes.guideContent}>
            <p className={classes.guideText}>
              At QuickRating, we understand how hard it is to build credibility online — especially when you&apos;re just starting out. That&apos;s why we created an easy, all-in-one review page that helps your business look professional and trustworthy.
            </p>
          </Box>
        </Box>

        {/* Plan Section - How It Works */}
        <Box className={classes.planSection}>
          <h2 className={classes.planHeading}>How It Works</h2>
          <Box className={classes.planGrid}>
            <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center">
              <Grid item xs={12} md={3}>
                <Box className={classes.planStep}>
                  <Box className={classes.planIconContainer}>
                    <span className={classes.planStepNumber}>1</span>
                  </Box>
                  <h3 className={classes.planStepTitle}>Create Your Page</h3>
                  <p className={classes.planStepDescription}>
                    Sign up and customize your review page with your brand colors and business information in minutes.
                  </p>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className={classes.planStep}>
                  <Box className={classes.planIconContainer}>
                    <span className={classes.planStepNumber}>2</span>
                  </Box>
                  <h3 className={classes.planStepTitle}>Share Your Link</h3>
                  <p className={classes.planStepDescription}>
                    Get your unique link (quickrating.page/yourname) and share it with customers via social media, email, or text.
                  </p>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className={classes.planStep}>
                  <Box className={classes.planIconContainer}>
                    <span className={classes.planStepNumber}>3</span>
                  </Box>
                  <h3 className={classes.planStepTitle}>Collect and Showcase</h3>
                  <p className={classes.planStepDescription}>
                    Customers leave reviews on your page, and you showcase them to build trust and drive more sales.
                  </p>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Success Section */}
        <Box className={classes.successSection}>
          <h2 className={classes.successHeading}>With QuickRating, You Can:</h2>
          <Box className={classes.successGrid}>
            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
              <Grid item xs={12} md={3}>
                <Box className={classes.successCard}>
                  <CheckCircleIcon className={classes.successIcon} />
                  <p className={classes.successText}>
                    Build trust instantly with real customer reviews
                  </p>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className={classes.successCard}>
                  <CheckCircleIcon className={classes.successIcon} />
                  <p className={classes.successText}>
                    Share your review page anywhere — social media, email, or text
                  </p>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className={classes.successCard}>
                  <CheckCircleIcon className={classes.successIcon} />
                  <p className={classes.successText}>
                    Customize your page to match your brand in minutes
                  </p>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Failure Section */}
        <Box className={classes.failureSection}>
          <Box className={classes.failureContent}>
            <p className={classes.failureText}>
              Without a dedicated place for reviews, you risk losing potential customers who need social proof before buying. Don&apos;t let the lack of reviews hold your business back.
            </p>
          </Box>
        </Box>

        {/* Transformation Section */}
        <Box className={classes.transformationSection}>
          <Box className={classes.transformationGrid}>
            <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center">
              <Grid item xs={12} md={5}>
                <Box className={classes.transformationBefore}>
                  <h3 className={classes.transformationHeading}>Before QuickRating</h3>
                  <Box className={classes.transformationList}>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconBefore}>✗</span>
                      <span>No place to collect reviews</span>
                    </Box>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconBefore}>✗</span>
                      <span>Customers don&apos;t trust your business</span>
                    </Box>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconBefore}>✗</span>
                      <span>Hard to prove your credibility</span>
                    </Box>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconBefore}>✗</span>
                      <span>Losing sales to competitors</span>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box className={classes.transformationAfter}>
                  <h3 className={classes.transformationHeading}>After QuickRating</h3>
                  <Box className={classes.transformationList}>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconAfter}>✓</span>
                      <span>Clean, professional review page</span>
                    </Box>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconAfter}>✓</span>
                      <span>Real social proof from customers</span>
                    </Box>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconAfter}>✓</span>
                      <span>Instant credibility and trust</span>
                    </Box>
                    <Box className={classes.transformationItem}>
                      <span className={classes.transformationIconAfter}>✓</span>
                      <span>More confident buyers and sales</span>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Grid container sx={{ textAlign: 'center', margin: '100px auto', maxWidth: '1200px', padding: '0 24px' }}>
          <Grid container item xs={12} md={10} sx={{ textAlign: 'center', margin: '0 auto', alignItems: 'center' }}>
            <Grid item xs={12} md={6}>
              <Image
                className={classes.extraImage}
                src={'/devices.png'}
                alt={'devices'}
                width={400}
                height={400}
              />
            </Grid>
            <Grid item className={classes.extraInfoOne} xs={12} md={6} sx={{ textAlign: 'left' }}>
              <span className={classes.extraInfo}>Your beautiful branded page will be accessible from both desktops and mobile devices.</span>
            </Grid>
            <Grid item className={classes.extraInfoTwo} xs={12} md={6} sx={{ textAlign: 'left' }}>
              <span className={classes.extraInfo}>Let potential customers see the great things your existing customers have to say.</span>
            </Grid>
            <Grid item xs={12} md={6}>
              <Image
                className={classes.extraImage}
                src={'/rating.png'}
                alt={'rating'}
                width={400}
                height={400}
              />
            </Grid>
          </Grid>
        </Grid>
        <div className={classes.pricingHeader}>
          Pricing
        </div>
        <Grid container className={classes.pricingGrid}>
          <Grid container item xs={12} md={8} sx={{ margin: '0 auto' }}>
            <Grid item xs={12} md={6} className={classes.pricingRow}>
              <div className={classes.pricing}>
                <div className={classes.level}>
                  Basic
                </div>
                <div className={classes.price}>
                  Free
                </div>
                <div className={classes.intro}>
                  Features:
                </div>
                <div className={classes.list}>
                  <Grid container item>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        3 Reviews
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        All reviews published to page
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        Customized page
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div className={classes.startedDiv}>
                  <Link href={'/auth/signup'} passHref>
                    <Button
                      variant='contained'
                      fullWidth>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={classes.pricingRow}>
              <div className={`${classes.pricing} ${classes.standard}`}>
                <div className={classes.level}>
                  Standard
                </div>
                <div className={classes.price}>
                  $7 <span>/month</span>
                </div>
                <div className={classes.intro}>
                  Features:
                </div>
                <div className={classes.list}>
                  <Grid container item>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        Unlimited Reviews
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        Choose what reviews get published
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        Customized page
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        Notification of new reviews
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.listing}>
                        <CheckCircleIcon color="success" />
                        No QuickRating branding on page
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div className={classes.startedDiv}>
                  <Link href={'/auth/signup'} passHref>
                    <Button
                      variant='contained'
                      fullWidth>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>

        <div className={classes.comingSoon}>
          Analytics and reviews with images &amp; videos coming soon!
        </div>

        <div className={classes.secondaryAction}>
          <div className={classes.subHeadline}>
            If you have an Instagram or other online business and need a page for social proof, {CONSTANTS.appName} is for you. Elevate your brand reputation
            and drive conversions by showcasing real customer experiences. It&apos;s easy to get started.
          </div>
          <div style={{ marginTop: '40px' }}>
            <Link href={'/auth/signup'} passHref>
              <Button
                variant='contained'>
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Grid container className={classes.legal}>
        <Grid xs={12} md={4}>
          &copy; {new Date().getFullYear()} {CONSTANTS.appName}
        </Grid>
        <Grid xs={12} md={4}>
          <Link href={'legal/privacy'}>
            Privacy Policy
          </Link>
        </Grid>
        <Grid xs={12} md={4}>
          <Link href={'legal/terms'}>
            Terms &amp; Conditions
          </Link>
        </Grid>
      </Grid>
    </>
  );
}
