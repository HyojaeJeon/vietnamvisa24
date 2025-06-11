
"use client";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "./src/lib/apolloClient";
import StoreProvider from "./storeProvider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <ApolloProvider client={apolloClient}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </ApolloProvider>
    </StoreProvider>
  );
}
