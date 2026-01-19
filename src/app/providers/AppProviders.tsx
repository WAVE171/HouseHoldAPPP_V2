import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/shared/components/ui/toaster';
import { LanguageProvider } from '@/shared/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider defaultLanguage="pt-PT">
        {children}
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
