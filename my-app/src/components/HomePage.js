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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  // Updated features with requested titles/descriptions
  const features = [
    {
      icon: Clock,
      title: "Clock-IN and Clock-Out Tracking",
    },
    {
      icon: Shield,
      title: "Work Time Analytics",
    },
    {
      icon: Users,
      title: "Secure & Compliant",
    },
  ];

  return (
    <Box
      fill
      background={{
        color: "light-1",
        dark: false,
      }}
      style={{
        background:
          "linear-gradient(to bottom right, #d1fae5, #ffffff, #dbeafe)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        boxShadow: "inset 0 0 50px rgba(0,0,0,0.05)", // subtle vignette inside edges
      }}
      pad="large"
      align="center"
      justify="center"
    >
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

      {/* Dev Login box top left */}
      <Box
        style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
      >
        <Card
          background={{
            color: "white",
            opacity: "strong",
            dark: false,
          }}
          elevation="medium"
          pad="small"
          style={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: "12px",
            maxWidth: "200px",
          }}
        >
          <CardBody>
            <Text size="xsmall" weight="bold" color="dark-2" margin={{ bottom: "xsmall" }}>
              Dev Login As Manager
            </Text>
            <Text size="xsmall" color="dark-4">
              Email: can@gmail.com
            </Text>
            <Text size="xsmall" color="dark-4">
              Password: Can@1234
            </Text>
          </CardBody>
        </Card>
      </Box>

      {/* Login button top right */}
      <Box
        style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
      >
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

      <MotionBox
        width="large"
        align="center"
        gap="large"
        direction="column"
        style={{ position: "relative", zIndex: 1, maxWidth: 900, marginTop: "60px" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <MotionBox
          align="center"
          gap="medium"
          variants={itemVariants}
          textAlign="center"
        >
          <MotionBox
            variants={floatingVariants}
            animate="animate"
            style={{ position: "relative" }}
          >
            <Box
              width="128px"
              height="128px"
              background={{ color: "brand" }}
              round="medium"
              elevation="large"
              align="center"
              justify="center"
              style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            >
              <Clock color="white" size={64} />
            </Box>
            <MotionBox
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 32,
                height: 32,
                backgroundColor: "#ef4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart color="white" size={16} />
            </MotionBox>
          </MotionBox>

          <Heading
            level={1}
            size="xlarge"
            margin={{ vertical: "small" }}
            style={{
              background:
                "linear-gradient(to right, #0d9488, #0f766e, #2563eb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              whiteSpace: "nowrap",
              position: "relative",
              display: "inline-block",
              textShadow: "0 0 8px rgba(37, 99, 235, 0.7)", // subtle glow
            }}
          >
            Streamline Your

            {/* Underline animation */}
            <MotionBox
              background={{ color: "brand", opacity: "medium" }}
              style={{
                position: "absolute",
                height: 4,
                bottom: -6,
                left: 0,
                right: 0,
                borderRadius: 8,
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </Heading>
          <Heading
            level={1}
            size="xlarge"
            margin={{ vertical: "small" }}
            style={{
              background:
                "linear-gradient(to right, #0d9488, #0f766e, #2563eb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              whiteSpace: "nowrap",
              position: "relative",
              display: "inline-block",
              textShadow: "0 0 8px rgba(37, 99, 235, 0.7)", // subtle glow
            }}
          >
            Healthcare Shift Management

            {/* Underline animation */}
            <MotionBox
              background={{ color: "brand", opacity: "medium" }}
              style={{
                position: "absolute",
                height: 4,
                bottom: -6,
                left: 0,
                right: 0,
                borderRadius: 8,
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </Heading>

          <Text size="large" color="dark-3" style={{ maxWidth: 600 }}>
            An intuitive, powerful solution designed specifically for healthcare
            professionals to manage shifts, track time, and coordinate seamlessly
            with their teams.
          </Text>
        </MotionBox>

        {/* Auth Section for logged in */}
        {isAuthenticated && (
          <MotionBox
            variants={itemVariants}
            width="medium"
            align="center"
            margin={{ vertical: "medium" }}
          >
            <Card
              background={{
                color: "white",
                opacity: "medium",
                dark: false,
              }}
              elevation="large"
              pad="medium"
              width="100%"
              style={{
                background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
                borderRadius: 12,
              }}
            >
              <CardBody>
                <Box
                  direction="row"
                  gap="medium"
                  align="center"
                  margin={{ bottom: "small" }}
                >
                  <Box
                    background="brand"
                    round="full"
                    pad="small"
                    align="center"
                    justify="center"
                    width="48px"
                    height="48px"
                    elevation="medium"
                  >
                    <Users color="white" size={24} />
                  </Box>
                  <Box>
                    <Text size="small" color="dark-4">
                      Welcome back,
                    </Text>
                    <Text weight="bold" size="medium" color="dark-1">
                      {user?.name || user?.email}
                    </Text>
                  </Box>
                </Box>
                <Button
                  label="Sign Out Securely"
                  onClick={() => logout({ returnTo: window.location.origin })}
                  primary
                  color="status-critical"
                  size="large"
                  style={{ borderRadius: 12 }}
                  focusIndicator={true}
                />
              </CardBody>
            </Card>
          </MotionBox>
        )}
        <MotionBox
          as="section"
          direction="column"
          gap="large"
          width="100%"
          variants={containerVariants}
          margin={{ vertical: "large" }}
        >
          <Box
            direction="column"
            gap="large"
            width="100%"
            align="center"
          >
            {/* First row: 2 features side by side */}
            <Box
              direction="row"
              gap="xlarge"
              justify="center"
              wrap={false}
              width="100%"
              maxWidth="800px"
            >
              {[features[0], features[1]].map(({ icon: Icon, title }, i) => (
                <MotionBox
                  key={i}
                  basis="medium"
                  flex={{ grow: 1, shrink: 0 }}
                  background={{ color: "white", opacity: "medium" }}
                  elevation="large"
                  pad="large"
                  round="medium"
                  align="center"
                  gap="small"
                  variants={itemVariants}
                  style={{ cursor: "default" }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box
                    background="brand"
                    round="medium"
                    pad="medium"
                    align="center"
                    justify="center"
                    elevation="large"
                    style={{ boxShadow: "0 15px 25px rgba(0,0,0,0.2)" }}
                  >
                    <Icon color="white" size={40} />
                  </Box>
                  <Heading
                    level={3}
                    margin="none"
                    color="dark-1"
                    textAlign="center"
                  >
                    {title}
                  </Heading>
                </MotionBox>
              ))}
            </Box>

            <Box direction="row" justify="center" width="100%" maxWidth="400px">
              {(() => {
                const Icon = features[2].icon;
                return (
                  <MotionBox
                    basis="medium"
                    flex={{ grow: 0, shrink: 0 }}
                    background={{ color: "white", opacity: "medium" }}
                    elevation="large"
                    pad="large"
                    round="medium"
                    align="center"
                    gap="small"
                    variants={itemVariants}
                    style={{ cursor: "default" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    width="medium"
                  >
                    <Box
                      background="brand"
                      round="medium"
                      pad="medium"
                      align="center"
                      justify="center"
                      elevation="large"
                      style={{ boxShadow: "0 15px 25px rgba(0,0,0,0.2)" }}
                    >
                      <Icon color="white" size={40} />
                    </Box>
                    <Heading
                      level={3}
                      margin="none"
                      color="dark-1"
                      textAlign="center"
                    >
                      {features[2].title}
                    </Heading>
                  </MotionBox>
                );
              })()}
            </Box>
          </Box>
        </MotionBox>
      </MotionBox>
    </Box>
  );
};

export default HomePage;
