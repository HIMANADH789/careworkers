'use client';

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Heading,
  Text,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Notification,
} from "grommet";
import NavBar from "@/components/NavBar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

const GET_CLOCK_HISTORY_BY_USER = gql`
  query ClockHistoryByUser($userId: ID!) {
    clockHistoryByUser(userId: $userId) {
      id
      name
      email
      records {
        clockInAt
        clockInLat
        clockInLng
        clockInNote
        clockOutAt
        clockOutLat
        clockOutLng
        clockOutNote
      }
    }
  }
`;

export default function UserHistory() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("id");
  const userName = searchParams.get("name");

  const { data, loading, error } = useQuery(GET_CLOCK_HISTORY_BY_USER, {
    variables: { userId },
    skip: !userId,
  });

  if (!userId) {
    return <Text align="center" margin="medium">No user selected.</Text>;
  }

  if (loading) {
    return (
      <Box fill align="center" justify="center" height={{ min: "100vh" }}>
        <Text size="large">Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Notification
        status="critical"
        message={`Error: ${error.message}`}
        margin="medium"
      />
    );
  }

  const history = data?.clockHistoryByUser?.records || [];

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
        {/* NavBar full width, no top gap */}
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

        {/* Heading outside white box with bluish font */}
        <Heading
          level={2}
          margin={{ top: "medium", bottom: "small", horizontal: "auto" }}
          style={{ color: "#2563EB", fontWeight: 700, maxWidth: "70%", marginLeft: "auto", marginRight: "auto" }}
          alignSelf="center"
        >
          🕒 Clock History - {userName}
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
          

          {history.length === 0 ? (
            <Text alignSelf="center" size="large" margin={{ top: "medium" }}>
              No history found
            </Text>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Clock In Time</TableCell>
                  <TableCell>Clock In Location</TableCell>
                  <TableCell>Clock Out Time</TableCell>
                  <TableCell>Clock Out Location</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((rec, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {rec.clockInAt
                        ? new Date(Number(rec.clockInAt)).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {rec.clockInLat}, {rec.clockInLng}{" "}
                      {rec.clockInNote && `(${rec.clockInNote})`}
                    </TableCell>
                    <TableCell>
                      {rec.clockOutAt
                        ? new Date(Number(rec.clockOutAt)).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {rec.clockOutLat}, {rec.clockOutLng}{" "}
                      {rec.clockOutNote && `(${rec.clockOutNote})`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
    </RoleProtectedRoute>
  );
}
