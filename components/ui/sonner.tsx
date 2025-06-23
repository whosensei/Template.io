'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-right"
      expand={true}
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-background/80 backdrop-blur-md border border-border shadow-lg text-foreground rounded-lg p-4',
          success:
            'group toast bg-green-50/80 dark:bg-green-900/80 backdrop-blur-md border-green-200 dark:border-green-700 shadow-lg text-green-800 dark:text-green-100 rounded-lg p-4',
          error:
            'group toast bg-red-50/80 dark:bg-red-900/80 backdrop-blur-md border-red-200 dark:border-red-700 shadow-lg text-red-800 dark:text-red-100 rounded-lg p-4',
          warning:
            'group toast bg-orange-50/80 dark:bg-orange-900/80 backdrop-blur-md border-orange-200 dark:border-orange-700 shadow-lg text-orange-800 dark:text-orange-100 rounded-lg p-4',
          info:
            'group toast bg-blue-50/80 dark:bg-blue-900/80 backdrop-blur-md border-blue-200 dark:border-blue-700 shadow-lg text-blue-800 dark:text-blue-100 rounded-lg p-4',
          description: 'group-[.toast]:text-sm group-[.toast]:opacity-90 group-[.toast]:mt-1',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:transition-colors group-[.toast]:rounded-md group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1',
          cancelButton:
            'group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground group-[.toast]:hover:bg-secondary/80 group-[.toast]:transition-colors group-[.toast]:rounded-md',
          closeButton:
            'group-[.toast]:text-foreground/50 group-[.toast]:hover:text-foreground group-[.toast]:transition-colors',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
