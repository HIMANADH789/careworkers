'use client';

import React from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Heading,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Text,
  Notification,
} from "grommet";
import NavBar from "@/components/NavBar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

const GET_CLOCKED_IN_STAFF = gql`
  query {
    staffCurrentlyClockedIn {
      id
      name
      email
      clockInAt
    }
  }
`;

export default function AllStaffPage() {
  const { data, loading, error } = useQuery(GET_CLOCKED_IN_STAFF, {
    pollInterval: 30000, // refresh every 30s
  });

  if (loading)
    return (
      <Box fill align="center" justify="center" height={{ min: "100vh" }}>
        <Text size="large">Loading staff...</Text>
      </Box>
    );

  if (error)
    return (
      <Box fill align="center" justify="center" height={{ min: "100vh" }}>
        <Notification status="critical" message={`Error: ${error.message}`} />
      </Box>
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
        {/* Sticky full-width NavBar */}
        <Box
          fill="horizontal"
          style={{ margin: 0, padding: 0, position: "sticky", top: 0, zIndex: 100 }}
        >
          <NavBar
            items={[
              { name: "DashBoard", url: "/manager" },
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
          style={{
            color: "#2563EB",
            fontWeight: 700,
            maxWidth: "70%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          alignSelf="center"
        >
          👷 All Staff Currently Clocked In
        </Heading>

        {/* Table container */}
        <Box
          background="white"
          round="medium"
          elevation="medium"
          width="70%"
          margin={{ horizontal: "auto", bottom: "medium" }}
          pad="medium"
          style={{ minWidth: "320px" }}
          alignSelf="center"
        >
          {data.staffCurrentlyClockedIn.length === 0 ? (
            <Text alignSelf="center" size="large" margin="medium">
              No staff currently clocked in.
            </Text>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell scope="col" border="bottom" pad={{ horizontal: "small", vertical: "xsmall" }}>
                    Name
                  </TableCell>
                  <TableCell scope="col" border="bottom" pad={{ horizontal: "small", vertical: "xsmall" }}>
                    Email
                  </TableCell>
                  <TableCell scope="col" border="bottom" pad={{ horizontal: "small", vertical: "xsmall" }}>
                    Clock In Time
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.staffCurrentlyClockedIn.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell pad={{ horizontal: "small", vertical: "xsmall" }}>
                      {staff.name}
                    </TableCell>
                    <TableCell pad={{ horizontal: "small", vertical: "xsmall" }}>
                      {staff.email}
                    </TableCell>
                    <TableCell pad={{ horizontal: "small", vertical: "xsmall" }}>
                      {new Date(staff.clockInAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
