import { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

// Existing Queries
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

// Mutations
const CLOCK_IN_MUTATION = gql`
  mutation ClockIn($lat: Float!, $lng: Float!) {
    clockIn(lat: $lat, lng: $lng) {
      id
      clockInAt
    }
  }
`;

const CLOCK_OUT_MUTATION = gql`
  mutation ClockOut($lat: Float!, $lng: Float!) {
    clockOut(lat: $lat, lng: $lng) {
      id
      clockOutAt
    }
  }
`;

function UserInfo() {
  const [coords, setCoords] = useState(null);

  // Get user location once when component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Location access is required for clocking in/out.");
      }
    );
  }, []);

  // Queries
  const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY, {
    skip: !coords,
  });

  const {
    loading: clockLoading,
    error: clockError,
    data: clockData,
    refetch: refetchClockStatus,
  } = useQuery(CLOCK_STATUS_QUERY, {
    variables: coords || { lat: 0, lon: 0 },
    skip: !coords,
  });

  // Mutation hooks
  const [clockIn, { loading: clockInLoading, error: clockInError }] = useMutation(
    CLOCK_IN_MUTATION,
    {
      onCompleted: () => {
        refetchClockStatus();
      },
    }
  );

  const [clockOut, { loading: clockOutLoading, error: clockOutError }] = useMutation(
    CLOCK_OUT_MUTATION,
    {
      onCompleted: () => {
        refetchClockStatus();
      },
    }
  );

  if (!coords) return <p>Getting your location...</p>;
  if (meLoading || clockLoading) return <p>Loading...</p>;
  if (meError) return <p>Error fetching user info: {meError.message}</p>;
  if (clockError) return <p>Error fetching clock status: {clockError.message}</p>;

  if (!meData?.me) return <p>No user info found.</p>;

  const clockStatus = clockData?.clockStatus?.status;

  // Handlers
  const handleClockIn = () => {
    clockIn({
      variables: {
        lat: coords.lat,
        lng: coords.lon,
      },
    });
  };

  const handleClockOut = () => {
    clockOut({
      variables: {
        lat: coords.lat,
        lng: coords.lon,
      },
    });
  };

  return (
    <div>
      <h3>Welcome, {meData.me.name}</h3>
      <p>Email: {meData.me.email}</p>
      <p>Role: {meData.me.role}</p>
      <p>Clock Status: {clockStatus}</p>

      {clockStatus === "NOT_IN_PERIMETER" && (
        <p style={{ color: "red" }}>
          You are not in the allowed location to clock in/out.
        </p>
      )}

      {clockInError && <p style={{ color: "red" }}>Error clocking in: {clockInError.message}</p>}
      {clockInLoading && <p>Clocking in...</p>}

      {clockOutError && <p style={{ color: "red" }}>Error clocking out: {clockOutError.message}</p>}
      {clockOutLoading && <p>Clocking out...</p>}

      {clockStatus === "CAN_CLOCK_IN" && (
        <button onClick={handleClockIn}>Clock In</button>
      )}

      {clockStatus === "CAN_CLOCK_OUT" && (
        <button onClick={handleClockOut}>Clock Out</button>
      )}
    </div>
  );
}

export default UserInfo;