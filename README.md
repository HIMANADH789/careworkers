# CareWorkers Management Platform

A full-stack web application for managing care workers and managers. Provides role-based dashboards, real-time clock-in/out tracking, and user management with Auth0 authentication.

---

## To test the app please login for manager role as (There is no direct signup for manager):
can@gmail.com
Can@1234

## Authentication:
signup and login is provided for careworkers
signup is not provided for manager role , login can be done in same login page as that of care workers (Role will be detected automatically)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Role-Based Access](#role-based-access)
- [License](#license)

---

## Features

- **Role-based dashboards:** Separate views for Managers and CareWorkers.
- **Clock-in/out tracking:** Geolocation-enabled, real-time clock-in/out functionality.
- **Authentication & Authorization:** Secure login using Auth0 with JWT validation.
- **GraphQL API:** Backend powered by Apollo Server and Prisma ORM.
- **Notifications:** Alerts for clock-in/out, location restrictions, and errors.

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Apollo Client
- **Backend:** Node.js, Apollo Server, Prisma, PostgreSQL
- **Authentication:** Auth0
- **Deployment:** Frontend on Vercel, Backend on Render
- **Styling & UI:** MUI, Grommet, Framer Motion

---

## Project Structure

├─ my-app/ # Next.js frontend
│ ├─ app/ # Next.js app router pages
│ ├─ components/ # Reusable UI components
│ ├─ providers/ # AuthProvider, UserProvider
│ └─ lib/ # Apollo Client setup
├─ backend/ # Node.js + Apollo Server backend
│├─ resolvers/ # GraphQL resolvers
│├─ schema/ # GraphQL typeDefs
│├─ prisma/ # Prisma client and migrations
│└─ server.js # Entry point
└─ README.md
