import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Template',
  description: 'Professional email template management system for job applications',
  icons: {
    icon: "/favicon.ico",
  },
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
          colorInputText: '#111827',
          colorText: '#111827',
          colorTextSecondary: '#6b7280',
          colorDanger: '#dc2626',
          colorSuccess: '#16a34a',
          colorWarning: '#ca8a04',
          colorNeutral: '#6b7280',
          borderRadius: '8px',
        },
        elements: {
          rootBox: {
            fontFamily: inter.style.fontFamily,
          },
          card: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
          headerTitle: {
            color: '#111827',
            fontSize: '1.5rem',
            fontWeight: '600',
          },
          headerSubtitle: {
            color: '#6b7280',
          },
          socialButtonsBlockButton: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            color: '#111827',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#f9fafb',
            },
          },
          formButtonPrimary: {
            backgroundColor: '#000000',
            borderRadius: '8px',
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
          formFieldInput: {
            borderRadius: '8px',
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
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}