import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';

import { Providers } from '@/providers';

import Banner from './components/Banner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <title>Pomodoro Music</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="title" content="Pomodoro Music" />
        <meta name="description" content="A tool to remind you to focus." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://focusreminder.com/" />
        <meta property="og:title" content="Pomodoro Music" />
        <meta property="og:description" content="A tool to remind you to focus." />
        <meta property="og:image" content="https://focusreminder.com/og.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://focusreminder.com/" />
        <meta property="twitter:title" content="Pomodoro Music" />
        <meta property="twitter:description" content="A tool to remind you to focus." />
        <meta property="twitter:image" content="https://focusreminder.com/og.png" />

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R63J68BLKW" />
      </Head>
      <Providers>
        <body className={inter.className}>
          <Banner />
          {children}
          <div className="container mx-auto">
            <div id="embed-spotify" />
          </div>
        </body>
      </Providers>
    </html>
  );
}
