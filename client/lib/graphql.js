// Legacy GraphQL exports - redirects to the main organized GraphQL structure
// All GraphQL queries, mutations, and types are now organized in /app/src/lib/graphql/
export * from "../app/src/lib/graphql/index.js";

// Apollo Client is available separately
import { apolloClient } from "../app/src/lib/apolloClient";
export { apolloClient };
