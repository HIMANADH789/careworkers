// src/lib/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

console.log("GraphQL URL:", process.env.NEXT_PUBLIC_GRAPHQL_URL);
const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_URL }`,
});

export function createApolloClient(getAccessTokenSilently) {
  const authLink = setContext(async (_, { headers }) => {
    let token = null;
    try {
      token = await getAccessTokenSilently({
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      });
    } catch (e) {
      console.error("Failed to get Auth0 token:", e);
    }

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
