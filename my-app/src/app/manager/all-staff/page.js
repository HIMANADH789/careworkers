'use client';

import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
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

const GET_USERS_WITH_LAST_CLOCK = gql`
  query {
    usersWithLastClock {
      id
      name
      lastClock {
        clockInAt
        clockOutAt
      }
    }
  }
`;

export default function AllStaffPage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USERS_WITH_LAST_CLOCK);

  if (loading)
    return (
      <Box fill align="center" justify="center" height={{ min: "100vh" }}>
        <Text size="large">Loading staff list...</Text>
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
            cursor: "default",
          }}
          alignSelf="center"
        >
          👥 All Staff & Last Clock Records
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
          {data.usersWithLastClock.length === 0 ? (
            <Text alignSelf="center" size="large" margin="medium">
              No staff records found.
            </Text>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell scope="col" border="bottom" pad="small">
                    ID
                  </TableCell>
                  <TableCell scope="col" border="bottom" pad="small">
                    Name
                  </TableCell>
                  <TableCell scope="col" border="bottom" pad="small">
                    Last Clock In Date
                  </TableCell>
                  <TableCell scope="col" border="bottom" pad="small">
                    Last Clock In Time
                  </TableCell>
                  <TableCell scope="col" border="bottom" pad="small">
                    Last Clock Out Date
                  </TableCell>
                  <TableCell scope="col" border="bottom" pad="small">
                    Last Clock Out Time
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.usersWithLastClock.map((user) => (
                  <TableRow
                    key={user.id}
                    hoverIndicator="background"
                    onClick={() =>
                      router.push(
                        `/manager/user-history?id=${user.id}&name=${encodeURIComponent(
                          user.name
                        )}`
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell pad="small">{user.id}</TableCell>
                    <TableCell pad="small">{user.name}</TableCell>
                    <TableCell pad="small">
                      {user.lastClock?.clockInAt
                        ? new Date(Number(user.lastClock.clockInAt)).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell pad="small">
                      {user.lastClock?.clockInAt
                        ? new Date(Number(user.lastClock.clockInAt)).toLocaleTimeString()
                        : "—"}
                    </TableCell>
                    <TableCell pad="small">
                      {user.lastClock?.clockOutAt
                        ? new Date(Number(user.lastClock.clockOutAt)).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell pad="small">
                      {user.lastClock?.clockOutAt
                        ? new Date(Number(user.lastClock.clockOutAt)).toLocaleTimeString()
                        : "—"}
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
