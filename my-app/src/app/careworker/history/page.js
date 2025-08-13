'use client';

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Box, Heading, Text, List, Notification } from 'grommet';
import NavBar from "@/components/NavBar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

// Queries as before
const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

const CLOCK_HISTORY_BY_USER = gql`
  query ClockHistoryByUser($userId: ID!) {
    clockHistoryByUser(userId: $userId) {
      id
      name
      email
      records {
        clockInAt
        clockOutAt
      }
    }
  }
`;

export default function HistoryPage() {
  const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY);
  const {
    loading: historyLoading,
    error: historyError,
    data: historyData,
  } = useQuery(CLOCK_HISTORY_BY_USER, {
    variables: { userId: meData?.me?.id },
    skip: !meData?.me?.id,
  });

  if (meLoading || historyLoading) {
    return (
      <Box fill align="center" justify="center" height={{ min: '100vh' }}>
        <Text size="large">Loading...</Text>
      </Box>
    );
  }

  if (meError) {
    return <Notification status="critical" message={`Error fetching user: ${meError.message}`} />;
  }

  if (historyError) {
    return <Notification status="critical" message={`Error fetching history: ${historyError.message}`} />;
  }

  const records = historyData?.clockHistoryByUser?.records || [];

  return (
    <RoleProtectedRoute allowedRoles={['CAREWORKER']}>
      <Box
        fill
        align="center"
        justify="flex-start"
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom right, #d1fae5, #ffffff, #dbeafe)',
          zIndex: 0,
          paddingTop: 0,     // REMOVE padding at top
          marginTop: 0,      // REMOVE margin at top
        }}
      >
        {/* Floating circles background */}
        <Box
          round="full"
          background={{ color: 'brand', opacity: 'weak' }}
          style={{ position: 'absolute', top: 80, left: 40, width: 128, height: 128, zIndex: 0 }}
          animation={{ type: 'pulse', duration: 20000, repeat: 'indefinite' }}
        />
        <Box
          round="full"
          background={{ color: 'light-4', opacity: 'medium' }}
          style={{ position: 'absolute', top: 160, right: 80, width: 96, height: 96, zIndex: 0 }}
          animation={{ type: 'pulse', duration: 15000, repeat: 'indefinite' }}
        />
        <Box
          round="full"
          background={{ color: 'light-2', opacity: 'weak' }}
          style={{ position: 'absolute', bottom: 80, left: '25%', width: 160, height: 160, zIndex: 0 }}
          animation={{ type: 'pulse', duration: 25000, repeat: 'indefinite' }}
        />

        {/* NavBar full width with zero margin & padding */}
        <Box fill="horizontal" style={{ margin: 0, padding: 0 }}>
          <NavBar
            items={[
              { name: "Clock-IN/OUT", url: "/careworker" },
              { name: "History", url: "/careworker/history" },
              { name: "Settings", url: "/careworker/settings" },
            ]}
          />
        </Box>

        {/* Heading outside white box with bluish styling */}
        <Heading
          level={2}
          margin={{ top: 'small', bottom: 'medium' }}
          style={{ color: '#2563EB', fontWeight: '700' }}
          alignSelf="center"
        >
          Full Clock History for {meData?.me?.name}
        </Heading>

        {/* White content container centered with ~70% width */}
        <Box
          background="white"
          round="medium"
          elevation="large"
          width="70%"
          pad="medium"
          margin={{ bottom: 'medium' }}
          style={{ position: 'relative', zIndex: 1, minWidth: '320px' }}
          alignSelf="center"
        >
          {records.length === 0 ? (
            <Text alignSelf="center" size="large" margin={{ top: 'medium' }}>
              No clock history found.
            </Text>
          ) : (
            <List
              data={records}
              border={{ side: 'bottom' }}
              pad={{ horizontal: 'small', vertical: 'xsmall' }}
            >
              {(record, idx) => {
                const inDate = new Date(Number(record.clockInAt));
                const outDate = record.clockOutAt
                  ? new Date(Number(record.clockOutAt))
                  : null;

                const inFormatted = `${inDate.toLocaleDateString(
                  'en-GB'
                )} ${inDate.toLocaleTimeString()}`;
                const outFormatted = outDate
                  ? `${outDate.toLocaleDateString('en-GB')} ${outDate.toLocaleTimeString()}`
                  : null;

                return (
                  <Box
                    key={idx}
                    pad={{ vertical: 'small' }}
                    border={{ side: 'bottom', color: 'light-4' }}
                  >
                    <Text size="medium" weight="bold">
                      In: {inFormatted}
                    </Text>
                    {outFormatted && (
                      <Text size="small" color="dark-5">
                        Out: {outFormatted}
                      </Text>
                    )}
                  </Box>
                );
              }}
            </List>
          )}
        </Box>
      </Box>
    </RoleProtectedRoute>
  );
}
