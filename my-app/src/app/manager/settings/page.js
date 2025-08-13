'use client';

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Button,
  Notification,
} from "grommet";
import NavBar from "@/components/NavBar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

export default function ManagerSettingsPage() {
  const { logout, isAuthenticated } = useAuth0();
  const router = useRouter();

  const { data, loading, error } = useQuery(ME_QUERY);

  if (!isAuthenticated) {
    return <Text align="center" margin="medium">You must be logged in to view settings.</Text>;
  }

  if (loading) return <Text align="center" margin="medium">Loading your profile...</Text>;
  if (error)
    return (
      <Notification
        status="critical"
        message={`Error loading profile: ${error.message}`}
        margin="medium"
      />
    );

  const user = data?.me;

  return (
    <RoleProtectedRoute allowedRoles={["MANAGER"]}>
      <Box
        fill
        background={{
          color: "background",
          dark: false,
          image:
            "linear-gradient(to bottom right, #d1fae5, #ffffff, #dbeafe)",
        }}
        style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}
      >
        {/* NavBar full width, sticky at top */}
        <Box fill="horizontal" style={{ margin: 0, padding: 0, position: "sticky", top: 0, zIndex: 100 }}>
          <NavBar
            items={[
              { name: "DashBoard", url: "/manager" },
              { name: "All Staff", url: "/manager/all-staff" },
              { name: "Clocked In Staff", url: "/manager/clocked-in-staff" },
              { name: "Settings", url: "/manager/settings" },
            ]}
          />
        </Box>

        {/* Heading with bluish font, outside white box, centered */}
        <Heading
          level={2}
          margin={{ top: "medium", bottom: "medium", horizontal: "auto" }}
          style={{ color: "#2563EB", fontWeight: 700, maxWidth: "70%", marginLeft: "auto", marginRight: "auto" }}
          alignSelf="center"
        >
          Manager Settings
        </Heading>

        {/* Content container centered with 65-70% width */}
        <Box
          background="white"
          round="medium"
          elevation="medium"
          width="70%"
          margin={{ bottom: "medium", horizontal: "auto" }}
          pad="medium"
          style={{ minWidth: "320px" }}
          alignSelf="center"
        >
          <Box margin={{ bottom: "medium" }}>
            <Text><strong>Name:</strong> {user?.name}</Text>
          </Box>
          <Box margin={{ bottom: "medium" }}>
            <Text><strong>Email:</strong> {user?.email}</Text>
          </Box>
          <Box margin={{ bottom: "medium" }}>
            <Text><strong>Role:</strong> {user?.role}</Text>
          </Box>

          <Box direction="row" gap="small" wrap>
            <Button
              label="Change Profile"
              onClick={() => router.push("/manager/settings/change-profile")}
              primary
            />
            <Button
              label="Change Location Perimeter"
              onClick={() => router.push("/manager/settings/change-location-perimeter")}
              primary
            />
            <Button
              label="Logout"
              onClick={() => logout({ returnTo: window.location.origin })}
              color="status-critical"
              primary
            />
          </Box>
        </Box>

        {/* Floating bubbles background */}
        <Box
          round="full"
          background={{ color: "brand", opacity: "weak" }}
          style={{ position: "absolute", top: 80, left: 40, width: 128, height: 128, zIndex: 0 }}
          animation={{ type: "pulse", duration: 20000, repeat: "indefinite" }}
        />
        <Box
          round="full"
          background={{ color: "light-4", opacity: "medium" }}
          style={{ position: "absolute", top: 160, right: 80, width: 96, height: 96, zIndex: 0 }}
          animation={{ type: "pulse", duration: 15000, repeat: "indefinite" }}
        />
        <Box
          round="full"
          background={{ color: "light-2", opacity: "weak" }}
          style={{ position: "absolute", bottom: 80, left: "25%", width: 160, height: 160, zIndex: 0 }}
          animation={{ type: "pulse", duration: 25000, repeat: "indefinite" }}
        />
      </Box>
    </RoleProtectedRoute>
  );
}
