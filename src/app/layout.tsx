import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import "./globals.scss";
import { getMetaDataObject } from "@/lib/util";
import theme from './theme';
import { ThemeProvider } from "@mui/material/styles";
import { Lato } from 'next/font/google';
import Metrics from "@/components/metrics";
import FirebaseAnalytics from "@/components/firebaseAnalytics";

const lato = Lato({
    weight: ['400', '700'],
    style: ['italic', 'normal'],
    subsets: ['latin']
  })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://quickrating.page'),
  title: {
    default: 'QuickRating - Customer Review Pages for Small Businesses',
    template: '%s | QuickRating'
  },
  description: 'Collect customer reviews without a website. Create a branded page for your Instagram or WhatsApp business, with 15 reviews free.',
  authors: [{ name: 'QuickRating' }],
  creator: 'QuickRating',
  publisher: 'QuickRating',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'QuickRating — Customer Reviews Without a Website',
    description: 'Give customer feedback a home. Create a branded review page and share it on Instagram, WhatsApp, or email.',
    siteName: 'QuickRating',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'QuickRating customer review pages' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickRating — Customer Reviews Without a Website',
    description: 'Create a branded customer review page. Start with 15 reviews free.',
    images: ['/opengraph-image'],
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <body className={lato.className}>
            {children}
            <Metrics />
            <FirebaseAnalytics />
          </body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
