"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";

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

export default function AllStaff() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USERS_WITH_LAST_CLOCK);

  if (loading) return <p>Loading staff list...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>👥 All Staff & Last Clock Records</h2>
      <table
        border="1"
        cellPadding="8"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Last Clock In Date</th>
            <th>Last Clock In Time</th>
            <th>Last Clock Out Date</th>
            <th>Last Clock Out Time</th>
          </tr>
        </thead>
        <tbody>
          {data.usersWithLastClock.map((user) => (
            <tr key={user.id}>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() =>
                  router.push(
                    `/manager/user-history?id=${user.id}&name=${encodeURIComponent(user.name)}`
                  )
                }
              >
                {user.id}
              </td>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() =>
                  router.push(
                    `/manager/user-history?id=${user.id}&name=${encodeURIComponent(user.name)}`
                  )
                }
              >
                {user.name}
              </td>
              <td>
                {user.lastClock?.clockInAt
                  ? new Date(Number(user.lastClock.clockInAt)).toLocaleDateString()
                  : "—"}
              </td>
              <td>
                {user.lastClock?.clockInAt
                  ? new Date(Number(user.lastClock.clockInAt)).toLocaleTimeString()
                  : "—"}
              </td>
              <td>
                {user.lastClock?.clockOutAt
                  ? new Date(Number(user.lastClock.clockOutAt)).toLocaleDateString()
                  : "—"}
              </td>
              <td>
                {user.lastClock?.clockOutAt
                  ? new Date(Number(user.lastClock.clockOutAt)).toLocaleTimeString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
