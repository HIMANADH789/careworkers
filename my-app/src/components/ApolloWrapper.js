// src/components/ApolloWrapper.js
"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { createApolloClient } from "../lib/apolloClient";

export default function ApolloWrapper({ children }) {
  const { getAccessTokenSilently } = useAuth0();

  const client = React.useMemo(() => createApolloClient(getAccessTokenSilently), [getAccessTokenSilently]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
