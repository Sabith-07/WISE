import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'WISE',
  description: 'Your personal safety companion, empowering you with smart features to stay secure and connected.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className={`min-h-screen bg-background text-primary antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
