'use client'

export const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

import { QueryClient } from '@tanstack/react-query';

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
}

export const getQueryFn = (options) => async ({ queryKey }) => {
  const [url] = queryKey;
  
  try {
    return await apiRequest(url);
  } catch (error) {
    if (error.message.includes('401') && options.on401 === 'returnNull') {
      return null;
    }
    throw error;
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});