import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Email Builder - Create Stunning Email Templates',
  description:
    'Professional email template builder with drag-and-drop editor. Create, customize, and export beautiful email campaigns with ease. Built with Next.js, TypeScript, and modern web technologies.',
  keywords: [
    'email builder',
    'email templates',
    'email editor',
    'drag and drop',
    'email marketing',
    'email campaigns',
    'Next.js',
    'TypeScript',
    'React',
    'email design',
    'responsive emails',
  ],
  authors: [{ name: 'Email Builder Team' }],
  openGraph: {
    title: 'Email Builder - Professional Email Template Creator',
    description:
      'Create stunning email templates with our intuitive drag-and-drop builder',
    url: 'https://your-domain.com',
    siteName: 'Email Builder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email Builder - Create Beautiful Email Templates',
    description:
      'Professional email template builder with drag-and-drop interface',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
