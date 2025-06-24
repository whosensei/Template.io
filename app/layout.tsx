import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Template',
  description: 'Professional email template management system for job applications',
  icons: {
    icon: "/Email Template App Logo Jun 24 2025 (1).png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Analytics />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    let scrollTimeout;
                    
                    function addScrollListeners(element) {
                      if (!element || element.hasScrollListener) return;
                      element.hasScrollListener = true;
                      
                      element.addEventListener('scroll', function() {
                        this.classList.add('is-scrolling');
                        clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(() => {
                          this.classList.remove('is-scrolling');
                        }, 1000);
                      });
                    }
                    
                    // Add listeners to existing scrollable elements
                    function initScrollListeners() {
                      const scrollableElements = document.querySelectorAll('*');
                      scrollableElements.forEach(element => {
                        const style = window.getComputedStyle(element);
                        if (style.overflow === 'auto' || style.overflow === 'scroll' || 
                            style.overflowY === 'auto' || style.overflowY === 'scroll' ||
                            style.overflowX === 'auto' || style.overflowX === 'scroll') {
                          addScrollListeners(element);
                        }
                      });
                    }
                    
                    // Initialize on DOM ready
                    if (document.readyState === 'loading') {
                      document.addEventListener('DOMContentLoaded', initScrollListeners);
                    } else {
                      initScrollListeners();
                    }
                    
                    // Re-initialize periodically for dynamic content
                    setInterval(initScrollListeners, 2000);
                  })();
                `
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}