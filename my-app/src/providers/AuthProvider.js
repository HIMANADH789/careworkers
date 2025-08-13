// providers/AuthProvider.js
"use client";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";
const jwt = require('jsonwebtoken'); // <<< THIS LINE IS MANDATORY


const UserContext = createContext(null);

export function usePrismaUser() {
  return useContext(UserContext);
}

function UserProvider({ children }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const client = new ApolloClient({
          link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
            headers: { Authorization: `Bearer ${token}` },
          }),
          cache: new InMemoryCache(),
        });

        const { data } = await client.query({
          query: gql`
            query Me {
              me {
                id
                name
                email
                role
              }
            }
          `,
        });

        setUser(data.me);
      } catch (err) {
        console.error("Failed to fetch Prisma user:", err);
      }
    }

    fetchUser();
  }, [isAuthenticated, getAccessTokenSilently]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export default function AuthProvider({ children }) {
  const [redirectUri, setRedirectUri] = useState();

  useEffect(() => {
    setRedirectUri(window.location.origin);
  }, []);

  if (!redirectUri) return null;

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
    >
      <UserProvider>{children}</UserProvider>
    </Auth0Provider>
  );
}