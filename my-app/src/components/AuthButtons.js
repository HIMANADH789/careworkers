"use client";

import { useAuth0 } from "@auth0/auth0-react";

export default function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div style={{ marginBottom: 20 }}>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name || user?.email}</p>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
}
