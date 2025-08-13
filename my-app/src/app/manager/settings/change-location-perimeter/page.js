'use client';

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Box, Heading, TextInput, Button, Text, Notification } from "grommet";
import NavBar from "@/components/NavBar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

const GET_LOCATION_PERIMETER = gql`
  query {
    locationPerimeter {
      id
      name
      centerLat
      centerLng
      radiusKm
    }
  }
`;

const UPSERT_LOCATION_PERIMETER = gql`
  mutation UpsertLocationPerimeter(
    $name: String!
    $centerLat: Float!
    $centerLng: Float!
    $radiusKm: Float!
  ) {
    upsertLocationPerimeter(
      name: $name
      centerLat: $centerLat
      centerLng: $centerLng
      radiusKm: $radiusKm
    ) {
      id
      name
      centerLat
      centerLng
      radiusKm
    }
  }
`;

export default function ChangeLocationPerimeterPage() {
  const { data, loading, error } = useQuery(GET_LOCATION_PERIMETER);
  const [upsertLocationPerimeter, { loading: saving }] = useMutation(
    UPSERT_LOCATION_PERIMETER,
    {
      refetchQueries: [{ query: GET_LOCATION_PERIMETER }],
    }
  );

  const [name, setName] = useState("");
  const [centerLat, setCenterLat] = useState("");
  const [centerLng, setCenterLng] = useState("");
  const [radiusKm, setRadiusKm] = useState("");

  useEffect(() => {
    if (data?.locationPerimeter) {
      setName(data.locationPerimeter.name);
      setCenterLat(data.locationPerimeter.centerLat);
      setCenterLng(data.locationPerimeter.centerLng);
      setRadiusKm(data.locationPerimeter.radiusKm);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await upsertLocationPerimeter({
        variables: {
          name,
          centerLat: parseFloat(centerLat),
          centerLng: parseFloat(centerLng),
          radiusKm: parseFloat(radiusKm),
        },
      });
      alert("✅ Location perimeter saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save location perimeter");
    }
  };

  if (loading) return <Text align="center" margin="medium">Loading location perimeter...</Text>;
  if (error)
    return (
      <Notification
        status="critical"
        message={`Error: ${error.message}`}
        margin="medium"
      />
    );

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

        {/* Heading */}
        <Heading
          level={2}
          margin={{ top: "medium", bottom: "medium", horizontal: "auto" }}
          style={{ color: "#2563EB", fontWeight: 700, maxWidth: "70%", marginLeft: "auto", marginRight: "auto" }}
          alignSelf="center"
        >
          📍 Change Location Perimeter
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
          gap="medium"
        >
          <Box>
            <Text weight="bold" margin={{ bottom: "xsmall" }}>
              Name:
            </Text>
            <TextInput
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Perimeter Name"
            />
          </Box>

          <Box>
            <Text weight="bold" margin={{ bottom: "xsmall" }}>
              Center Latitude:
            </Text>
            <TextInput
              type="number"
              step="any"
              required
              value={centerLat}
              onChange={(e) => setCenterLat(e.target.value)}
              placeholder="e.g. 40.7128"
            />
          </Box>

          <Box>
            <Text weight="bold" margin={{ bottom: "xsmall" }}>
              Center Longitude:
            </Text>
            <TextInput
              type="number"
              step="any"
              required
              value={centerLng}
              onChange={(e) => setCenterLng(e.target.value)}
              placeholder="e.g. -74.0060"
            />
          </Box>

          <Box>
            <Text weight="bold" margin={{ bottom: "xsmall" }}>
              Radius (km):
            </Text>
            <TextInput
              type="number"
              step="any"
              required
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              placeholder="e.g. 2"
            />
          </Box>

          <Button
            type="submit"
            primary
            label={saving ? "Saving..." : "Save Perimeter"}
            disabled={saving}
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
