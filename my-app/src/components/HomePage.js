"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Shield, ChevronRight, Heart } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardBody, Heading, Text } from "grommet";

const MotionBox = motion(Box);

const HomePage = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
    },
  };

  const features = [
    { icon: Clock, title: "Clock-IN and Clock-Out Tracking" },
    { icon: Shield, title: "Work Time Analytics" },
    { icon: Users, title: "Secure & Compliant" },
  ];

  return (
    <Box
      fill
      background={{ color: "light-1", dark: false }}
      style={{
        background: "linear-gradient(to bottom right, #d1fae5, #ffffff, #dbeafe)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        boxShadow: "inset 0 0 50px rgba(0,0,0,0.05)",
      }}
      pad="large"
      align="center"
      justify="center"
    >
      {/* Top-left dev login text */}
      <Box
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "4px 8px",
          backgroundColor: "rgba(255,255,255,0.85)",
          borderRadius: 6,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        <Text size="small" weight="bold">
          Dev Login As Manager With: Email: can@gmail.com | Password: Can@1234
        </Text>
      </Box>

      {/* Animated Background Elements */}
      <Box
        fill
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: 80,
            left: 40,
            width: 128,
            height: 128,
            borderRadius: "50%",
            backgroundColor: "rgba(56, 178, 172, 0.2)",
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: 160,
            right: 80,
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "rgba(147, 197, 253, 0.3)",
          }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: 80,
            left: "25%",
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "rgba(167, 243, 208, 0.15)",
          }}
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </Box>

      {/* Login button top right */}
      <Box style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        {!isAuthenticated && (
          <Button
            label={
              <Box direction="row" align="center" gap="small">
                <Text>Sign In</Text>
                <ChevronRight size={20} />
              </Box>
            }
            onClick={() => loginWithRedirect()}
            primary
            color="brand"
            size="medium"
            style={{ borderRadius: 16, transition: "background-color 0.3s ease" }}
            hoverIndicator={{ background: "accent-1" }}
          />
        )}
      </Box>

      {/* Main MotionBox Content (Hero, Auth, Features) */}
      <MotionBox
        width="large"
        align="center"
        gap="large"
        direction="column"
        style={{ position: "relative", zIndex: 1, maxWidth: 900 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ... rest of your code remains 100% intact ... */}
      </MotionBox>
    </Box>
  );
};

export default HomePage;
