import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const replit_graphql_url = 'https://7b04571c-0d62-4a51-9cd2-f2eca1d84482-00-1bagmmob6jow8.picard.replit.dev:5000/graphql';
const local_graphql_url = 'http://localhost:5000/graphql';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || replit_graphql_url,
});

const authLink = setContext((_, { headers }) => {
  // Get tokens from localStorage
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  return {
    headers: {
      ...headers,
      authorization: userToken ? `Bearer ${userToken}` : "",
      'admin-token': adminToken ? adminToken : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

export default client;