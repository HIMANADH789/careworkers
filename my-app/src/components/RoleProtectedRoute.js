"use client";

import { usePrismaUser } from "@/providers/AuthProvider"; // ✅ Make sure the path is correct
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const user = usePrismaUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user === undefined) {
      // Still loading user data
      return;
    }

    if (!user || !allowedRoles.includes(user.role)) {
      router.replace("/forbidden"); // 🔒 Redirect to forbidden page
    } else {
      setChecking(false);
    }
  }, [user, allowedRoles, router]);

  if (checking || user === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
