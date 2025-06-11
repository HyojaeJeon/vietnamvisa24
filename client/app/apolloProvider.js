"use client";

import { ApolloProvider } from '@apollo/client';
import apolloClient from './src/lib/apolloClient';
import { useEffect, useState } from 'react';

export default function CustomApolloProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return children;
  }

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}