"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: "bold", fontSize: "5rem" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        It might have been moved or deleted.
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{ borderRadius: "30px", px: 4 }}
        onClick={() => router.push("/")}
      >
        Go Home
      </Button>
    </Box>
  );
}
