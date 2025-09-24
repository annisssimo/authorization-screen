import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import { AuthScreen } from '@/components/AuthScreen';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.code === 'INVALID_CREDENTIALS' || 
            error?.code === 'USER_NOT_FOUND' ||
            error?.code === 'INVALID_2FA_CODE') {
          return false;
        }
        // Retry network errors up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations that failed due to user errors
        if (error?.code === 'INVALID_CREDENTIALS' || 
            error?.code === 'INVALID_2FA_CODE' ||
            error?.code === 'VALIDATION_ERROR') {
          return false;
        }
        // Retry network and server errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
          },
        }}
      >
        <div className="App">
          <AuthScreen />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;

