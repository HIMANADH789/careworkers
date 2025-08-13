"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { Box, Button, Heading, Form, FormField, TextInput, Spinner, Notification, Text } from "grommet";
import { motion } from "framer-motion";

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

const FloatingCircle = ({ style, animateProps, transitionProps }) => (
  <motion.div
    style={{
      position: "absolute",
      borderRadius: "50%",
      ...style,
    }}
    animate={animateProps}
    transition={transitionProps}
  />
);

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
      <Box fill align="center" justify="center" pad="large">
        <Text size="large" color="status-warning">
          You must be logged in to update your profile.
        </Text>
      </Box>
    );
  }

  if (loading)
    return (
      <Box fill align="center" justify="center" pad="large">
        <Spinner size="large" />
        <Text margin={{ top: "small" }} size="large" color="dark-4">
          Loading profile...
        </Text>
      </Box>
    );

  if (error)
    return (
      <Box fill align="center" justify="center" pad="large">
        <Notification status="critical" message={`Error loading profile: ${error.message}`} />
      </Box>
    );

  const handleSubmit = async ({ value }) => {
    try {
      await updateMe({
        variables: { data: { name: value.name } },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={["CAREWORKER"]}>
      <Box
        fill
        pad="medium"
        align="center"
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          background:
            "linear-gradient(to bottom right, #d1fae5, #ffffff, #dbeafe)",
        }}
      >
        {/* Floating circles */}
        <FloatingCircle
          style={{
            top: 80,
            left: 40,
            width: 128,
            height: 128,
            backgroundColor: "rgba(56, 178, 172, 0.2)",
            zIndex: 0,
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <FloatingCircle
          style={{
            top: 160,
            right: 80,
            width: 96,
            height: 96,
            backgroundColor: "rgba(147, 197, 253, 0.3)",
            zIndex: 0,
          }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <FloatingCircle
          style={{
            bottom: 80,
            left: "25%",
            width: 160,
            height: 160,
            backgroundColor: "rgba(167, 243, 208, 0.15)",
            zIndex: 0,
          }}
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* NavBar full width */}
        <Box
          width="100%"
          style={{ position: "sticky", top: 0, zIndex: 10 }}
          background="white"
          elevation="large"
          pad={{ vertical: "small" }}
          margin={{ bottom: "large" }}
        >
          <NavBar
            items={[
              { name: "Clock-IN/OUT", url: "/careworker" },
              { name: "History", url: "/careworker/history" },
              { name: "Settings", url: "/careworker/settings" },
            ]}
          />
        </Box>

        {/* Content box */}
        <Box
          background="white"
          round="medium"
          pad="large"
          width="70vw"
          elevation="large"
          style={{ zIndex: 1 }}
        >
          <Heading level={2} margin={{ bottom: "medium" }} color="#1E40AF">
            Change Profile
          </Heading>

          <Form
            onSubmit={handleSubmit}
            value={{ name }}
            onChange={(nextValue) => setName(nextValue.name)}
          >
            <FormField
              label="Name"
              name="name"
              required
              margin={{ bottom: "medium" }}
            >
              <TextInput name="name" />
            </FormField>

            <Box direction="row" gap="medium">
              <Button
                type="submit"
                primary
                label={updating ? "Updating..." : "Update"}
                disabled={updating}
              />
              <Button
                label="Cancel"
                onClick={() => router.push("/careworker/settings")}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </RoleProtectedRoute>
  );
}
