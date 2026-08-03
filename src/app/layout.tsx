import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import "./globals.scss";
import { getMetaDataObject } from "@/lib/util";
import theme from './theme';
import { ThemeProvider } from "@mui/material/styles";
import { Lato } from 'next/font/google';
import Metrics from "@/components/metrics";

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
  description: 'Collect and display customer reviews with custom landing pages. Perfect for Instagram businesses and online entrepreneurs without websites. Free plan available.',
  keywords: ['customer reviews', 'review page', 'small business', 'Instagram business', 'online reviews', 'social proof', 'testimonials', 'review management'],
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
      title: 'QuickRating - Customer Review Pages for Small Businesses',
      description: 'Collect and display customer reviews with custom landing pages. Perfect for Instagram businesses and online entrepreneurs.',
      url: 'https://quickrating.page',
      siteName: 'QuickRating',
      locale: 'en_US',
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
          </body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
