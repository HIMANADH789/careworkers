"use client";

import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import NavBar from "@/components/NavBar";
import {
  Box,
  Button,
  Heading,
  Text,
  TextArea,
  Spinner,
  Notification,
} from "grommet";
import { motion } from "framer-motion";

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

const CLOCK_STATUS_QUERY = gql`
  query ClockStatus($lat: Float!, $lon: Float!) {
    clockStatus(lat: $lat, lon: $lon) {
      status
      lastClockInId
      clockInAt
      clockOutAt
    }
  }
`;

const USER_LATEST_CLOCK_INS_QUERY = gql`
  query UserLatestClockIns {
    userLatestClockIns {
      id
      clockInAt
      clockInNote
      clockOutAt
      clockOutNote
    }
  }
`;

const CLOCK_IN_MUTATION = gql`
  mutation ClockIn($lat: Float!, $lng: Float!, $note: String) {
    clockIn(lat: $lat, lng: $lng, note: $note) {
      id
      clockInAt
    }
  }
`;

const CLOCK_OUT_MUTATION = gql`
  mutation ClockOut($lat: Float!, $lng: Float!, $note: String) {
    clockOut(lat: $lat, lng: $lng, note: $note) {
      id
      clockOutAt
    }
  }
`;

const MotionBox = motion(Box);

function truncateText(text, maxWords = 20) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

export default function UserInfoPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const [coords, setCoords] = useState(null);
  const [clockInNote, setClockInNote] = useState("");
  const [clockOutNote, setClockOutNote] = useState("");

  // Get user coordinates
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            // Use consistent naming and ensure numbers
            const lat = parseFloat(pos.coords.latitude);
            const lng = parseFloat(pos.coords.longitude);
            setCoords({ lat, lon: lng });
            console.log("User coords set:", { lat, lon: lng });
          },
          (err) => {
            console.error("Error getting location:", err);
            alert("Location access is required for clocking in/out.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  }, [authLoading, isAuthenticated]);

  const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY, {
    skip: !isAuthenticated,
  });

  const {
    loading: clockLoading,
    error: clockError,
    data: clockData,
    refetch: refetchClockStatus,
  } = useQuery(CLOCK_STATUS_QUERY, {
    variables: coords || { lat: 0, lon: 0 },
    skip: !isAuthenticated || !coords,
    pollInterval: 10000,
  });

  const {
    loading: latestClocksLoading,
    error: latestClocksError,
    data: latestClocksData,
    refetch: refetchLatestClocks,
  } = useQuery(USER_LATEST_CLOCK_INS_QUERY, {
    skip: !isAuthenticated,
  });

  const [clockIn, { loading: clockInLoading, error: clockInError }] = useMutation(
    CLOCK_IN_MUTATION,
    {
      onCompleted: () => {
        refetchClockStatus();
        refetchLatestClocks();
        setClockInNote("");
      },
    }
  );

  const [clockOut, { loading: clockOutLoading, error: clockOutError }] = useMutation(
    CLOCK_OUT_MUTATION,
    {
      onCompleted: () => {
        refetchClockStatus();
        refetchLatestClocks();
        setClockOutNote("");
      },
    }
  );

  // Loading & error states
  if (authLoading) return <CenteredSpinner label="Checking authentication..." />;
  if (!isAuthenticated) return <CenteredMessage message="Please log in to continue." />;
  if (!coords) return <CenteredSpinner label="Getting your location..." />;
  if (
    meLoading ||
    clockLoading ||
    clockInLoading ||
    clockOutLoading ||
    latestClocksLoading
  )
    return <CenteredSpinner label="Loading..." />;
  if (meError)
    return (
      <NotificationMessage
        message={`Error fetching user info: ${meError.message}`}
        status="critical"
      />
    );
  if (clockError)
    return (
      <NotificationMessage
        message={`Error fetching clock status: ${clockError.message}`}
        status="critical"
      />
    );
  if (latestClocksError)
    return (
      <NotificationMessage
        message={`Error fetching clock-in history: ${latestClocksError.message}`}
        status="critical"
      />
    );
  if (!meData?.me)
    return <NotificationMessage message="No user info found." status="warning" />;

  const clockStatus = clockData?.clockStatus?.status;
  const isClockedIn = clockStatus === "CAN_CLOCK_OUT";
  const isInPerimeter = clockStatus !== "NOT_IN_PERIMETER";

  const handleClockIn = () => {
    clockIn({
      variables: {
        lat: coords.lat,
        lng: coords.lon,
        note: clockInNote.trim() === "" ? null : clockInNote,
      },
    });
  };

  const handleClockOut = () => {
    clockOut({
      variables: {
        lat: coords.lat,
        lng: coords.lon,
        note: clockOutNote.trim() === "" ? null : clockOutNote,
      },
    });
  };

  // Floating circles background
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

  // Render clock-in/out chat
  const renderClockInOutPairs = () => {
    if (!latestClocksData?.userLatestClockIns?.length) {
      return <Text>No recent clock-ins found.</Text>;
    }

    return latestClocksData.userLatestClockIns.map((item, index) => {
      const isLeft = index % 2 === 0;
      return (
        <Box
          key={item.id}
          direction="column"
          align={isLeft ? "start" : "end"}
          margin={{ vertical: "small" }}
          style={{ width: "100%" }}
        >
          <Box
            background="light-2"
            pad="small"
            round="small"
            style={{
              width: "55%",
              color: "#003366",
              wordBreak: "break-word",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            <Text weight="bold" size="small" margin={{ bottom: "xsmall" }}>
              Clocked In:{" "}
              {new Date(Number(item.clockInAt)).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
            {item.clockInNote && (
              <Text size="small">{truncateText(item.clockInNote)}</Text>
            )}
          </Box>
          {item.clockOutAt && (
            <Box
              background="light-3"
              pad="small"
              round="small"
              margin={{ top: "small" }}
              style={{
                width: "55%",
                color: "#004080",
                wordBreak: "break-word",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Text weight="bold" size="small" margin={{ bottom: "xsmall" }}>
                Clocked Out:{" "}
                {new Date(Number(item.clockOutAt)).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Text>
              {item.clockOutNote && (
                <Text size="small">{truncateText(item.clockOutNote)}</Text>
              )}
            </Box>
          )}
        </Box>
      );
    });
  };

  return (
    <RoleProtectedRoute allowedRoles={["CAREWORKER"]}>
      <Box
        fill
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(to bottom right, #d1fae5, #ffffff, #dbeafe)",
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
          }}
          animateProps={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transitionProps={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <FloatingCircle
          style={{
            top: 160,
            right: 80,
            width: 96,
            height: 96,
            backgroundColor: "rgba(147, 197, 253, 0.3)",
          }}
          animateProps={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transitionProps={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <FloatingCircle
          style={{
            bottom: 80,
            left: "25%",
            width: 160,
            height: 160,
            backgroundColor: "rgba(167, 243, 208, 0.15)",
          }}
          animateProps={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transitionProps={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* NavBar */}
        <Box
          width="100%"
          style={{ position: "sticky", top: 0, zIndex: 1000 }}
          background="white"
          elevation="large"
          pad={{ vertical: "small" }}
        >
          <NavBar
            items={[
              { name: "Clock-IN/OUT", url: "/careworker" },
              { name: "History", url: "/careworker/history" },
              { name: "Settings", url: "/careworker/settings" },
            ]}
          />
        </Box>

        <Box margin={{ top: "medium", horizontal: "auto" }} width="70vw" pad={{ vertical: "medium" }}>
          <Heading level={2} margin={{ bottom: "small" }} style={{ color: "#1E40AF" }}>
            Welcome, {meData.me.name}
          </Heading>
          <Text size="medium" color="#2563EB" margin={{ bottom: "medium" }}>
            Role: {meData.me.role} | Email: {meData.me.email}
          </Text>

          {(clockInError || clockOutError) && (
            <>
              {clockInError && <Notification status="critical" message={`Error clocking in: ${clockInError.message}`} margin={{ bottom: "small" }} />}
              {clockOutError && <Notification status="critical" message={`Error clocking out: ${clockOutError.message}`} margin={{ bottom: "small" }} />}
            </>
          )}

          {!isInPerimeter && (
            <Notification
              status="warning"
              message="You are not in the allowed location to clock in/out."
              margin={{ bottom: "medium" }}
            />
          )}

          {isInPerimeter && (
            <>
              {!isClockedIn && (
                <Box margin={{ bottom: "medium" }}>
                  <Text margin={{ bottom: "xsmall" }}>Clock In Note (optional):</Text>
                  <TextArea value={clockInNote} onChange={(e) => setClockInNote(e.target.value)} placeholder="Add a note for clocking in..." resize={false} fill margin={{ bottom: "small" }} style={{ minHeight: 72 }} />
                  <Button primary label="Clock In" color="status-ok" onClick={handleClockIn} />
                </Box>
              )}
              {isClockedIn && (
                <Box margin={{ bottom: "medium" }}>
                  <Text margin={{ bottom: "xsmall" }}>Clock Out Note (optional):</Text>
                  <TextArea value={clockOutNote} onChange={(e) => setClockOutNote(e.target.value)} placeholder="Add a note for clocking out..." resize={false} fill margin={{ bottom: "small" }} style={{ minHeight: 72 }} />
                  <Button primary label="Clock Out" color="status-critical" onClick={handleClockOut} />
                </Box>
              )}
            </>
          )}

          <Box margin={{ top: "large" }}>
            <Heading level={4} margin={{ bottom: "medium" }}>Your Last 10 Clock-Ins</Heading>
            {latestClocksLoading ? <Spinner /> : <Box>{renderClockInOutPairs()}</Box>}
          </Box>
        </Box>
      </Box>
    </RoleProtectedRoute>
  );
}

// Helper components
const CenteredSpinner = ({ label }) => (
  <Box fill align="center" justify="center" pad="large">
    <Spinner size="large" />
    {label && <Text margin={{ top: "small" }} size="large" color="dark-4">{label}</Text>}
  </Box>
);
const CenteredMessage = ({ message }) => (
  <Box fill align="center" justify="center" pad="large">
    <Text size="large" color="dark-4">{message}</Text>
  </Box>
);
const NotificationMessage = ({ message, status }) => (
  <Box fill align="center" justify="center" pad="large">
    <Notification status={status} message={message} />
  </Box>
);
