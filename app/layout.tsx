import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Template',
  description: 'Professional email template management system for job applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#000000',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#000000',
          colorText: '#000000',
          colorTextSecondary: '#666666',
          colorDanger: '#dc2626',
          colorSuccess: '#16a34a',
          colorWarning: '#ca8a04',
          colorNeutral: '#6b7280',
          borderRadius: '6px',
        },
        elements: {
          rootBox: {
            fontFamily: inter.style.fontFamily,
          },
          card: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
          headerTitle: {
            color: '#000000',
          },
          headerSubtitle: {
            color: '#666666',
          },
          socialButtonsBlockButton: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#f9fafb',
            },
          },
          formButtonPrimary: {
            backgroundColor: '#000000',
            '&:hover': {
              backgroundColor: '#374151',
            },
          },
          footerActionLink: {
            color: '#000000',
            '&:hover': {
              color: '#374151',
            },
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}