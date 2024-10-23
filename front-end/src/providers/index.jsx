import { Button } from '../components/ui/button';
import { useRouter } from '../routes/hooks/use-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import ThemeProvider from './theme-provider';
import UserContext from '../context/UserContext';

export const queryClient = new QueryClient();

const ErrorFallback = ({ error }) => {
  const router = useRouter();
  console.log('error', error);
  return (
    <div
      className="flex h-screen w-screen flex-col items-center  justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-2xl font-semibold">
        Ooops, something went wrong :({' '}
      </h2>
      <pre className="text-2xl font-bold">{error.message}</pre>
      <pre>{error.stack}</pre>
      <Button className="mt-4" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
};

export default function AppProvider({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HelmetProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <UserContext>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                {children}
              </ThemeProvider>
            </QueryClientProvider>
          </UserContext >
        </ErrorBoundary>
      </HelmetProvider>
    </Suspense>
  );
}
