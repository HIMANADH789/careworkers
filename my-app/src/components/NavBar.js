"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Typography } from "@mui/material";

export default function NavBar({ items }) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: "flex",
        gap: "1.5rem",
        padding: "1rem 2rem",
        background: "#f8f9fa",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {items
        .filter((item) => item.url !== pathname)
        .map((item) => (
          <Link
            key={item.url}
            href={item.url}
            passHref
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#008080", // Using the accent color for links
                fontWeight: "600",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "0",
                  height: "2px",
                  bottom: "-4px",
                  left: "0",
                  backgroundColor: "#008080",
                  transition: "width 0.3s ease-in-out",
                },
                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              {item.name}
            </Typography>
          </Link>
        ))}
    </Box>
  );
}
