'use client';

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Heading,
  TextInput,
  Button,
  Text,
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
    }
  }
`;

const UPDATE_ME_MUTATION = gql`
  mutation UpdateMe($data: UpdateUserInput!) {
    updateMe(data: $data) {
      id
      name
    }
  }
`;

export default function ChangeProfilePage() {
  const { isAuthenticated } = useAuth0();
  const router = useRouter();

  const { data, loading, error } = useQuery(ME_QUERY);
  const [updateMe, { loading: updating }] = useMutation(UPDATE_ME_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const [name, setName] = useState("");

  useEffect(() => {
    if (data?.me) {
      setName(data.me.name || "");
    }
  }, [data]);

  if (!isAuthenticated) {
    return (
      <Text align="center" margin="medium">
        You must be logged in to update your profile.
      </Text>
    );
  }

  if (loading) return <Text align="center" margin="medium">Loading profile...</Text>;
  if (error)
    return (
      <Notification
        status="critical"
        message={`Error loading profile: ${error.message}`}
        margin="medium"
      />
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMe({
        variables: { data: { name } },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

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
        {/* NavBar full width, sticky top */}
        <Box fill="horizontal" style={{ margin: 0, padding: 0, position: "sticky", top: 0, zIndex: 100 }}>
          <NavBar
            items={[
              { name: "Dashboard", url: "/manager" },
              { name: "All Staff", url: "/manager/all-staff" },
              { name: "Clocked In Staff", url: "/manager/clocked-in-staff" },
              { name: "Settings", url: "/manager/settings" },
            ]}
          />
        </Box>

        {/* Heading with bluish font, bold, centered */}
        <Heading
          level={2}
          margin={{ top: "medium", bottom: "medium", horizontal: "auto" }}
          style={{ color: "#2563EB", fontWeight: 700, maxWidth: "70%", marginLeft: "auto", marginRight: "auto" }}
          alignSelf="center"
        >
          Change Profile
        </Heading>

        {/* Form container */}
        <Box
          background="white"
          round="medium"
          elevation="medium"
          width="70%"
          margin={{ bottom: "medium", horizontal: "auto" }}
          pad="medium"
          style={{ minWidth: "320px" }}
          alignSelf="center"
          as="form"
          onSubmit={handleSubmit}
        >
          <Text weight="bold" margin={{ bottom: "xsmall" }}>
            Name:
          </Text>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin={{ bottom: "medium" }}
            required
          />

          <Button
            type="submit"
            primary
            label={updating ? "Updating..." : "Update"}
            disabled={updating}
          />
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
