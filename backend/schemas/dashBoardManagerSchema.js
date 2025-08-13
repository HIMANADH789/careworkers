const { gql } = require("apollo-server-express");

const dashBoardManagerSchema = gql`
  type ManagerDashboard {
    # Basic Statistics
    activeStaffCount: Int!
    totalManagersCount: Int!
    totalShifts: Int!
    
    # Existing Charts (Line & Bar Charts)
    weeklyClockInCounts: [ClockInsCountPerDay!]!
    avgHoursPerDay: [AvgHoursPerDay!]!
    totalHoursPerStaffLastWeek: [StaffHours!]!
    
    # New Charts
    roleDistribution: [RoleDistribution!]!           # Pie Chart
    shiftDurationDistribution: [ShiftDurationRange!]! # Pie Chart
    monthlyTrend: [MonthlyTrendData!]!               # Line Chart
    peakHoursData: [PeakHourData!]!                  # Bar Chart
    currentDayStatus: CurrentDayStatus!              # Stats Cards
    topPerformers: [TopPerformer!]!                  # Table/Bar Chart
  }

  # Existing Types
  type ClockInsCountPerDay {
    date: String!
    count: Int!
  }

  type AvgHoursPerDay {
    date: String!
    avgHours: Float!
  }

  type StaffHours {
    staffId: ID!
    name: String!
    totalHours: Float!
  }

  # New Types for Enhanced Charts

  # For Role Distribution Pie Chart
  type RoleDistribution {
    role: String!
    count: Int!
    percentage: Int!
  }

  # For Shift Duration Distribution Pie Chart
  type ShiftDurationRange {
    range: String!           # "Under 4 hours", "4-6 hours", etc.
    count: Int!
    percentage: Int!
  }

  # For Monthly Trend Line Chart
  type MonthlyTrendData {
    week: String!            # "Week 1", "Week 2", etc.
    activeUsers: Int!
  }

  # For Peak Hours Bar Chart
  type PeakHourData {
    hour: String!            # "09:00", "10:00", etc.
    clockIns: Int!
  }

  # For Current Day Status Cards
  type CurrentDayStatus {
    currentlyActive: Int!     # Users currently clocked in
    completedShifts: Int!     # Shifts completed today
    totalTodayShifts: Int!    # Total shifts started today
  }

  # For Top Performers Table/Chart
  type TopPerformer {
    staffId: ID!
    name: String!
    totalHours: Float!
    shiftCount: Int!
    avgHoursPerShift: Float!
  }

  type Query {
    dashBoardManager: ManagerDashboard!
  }
`;

module.exports = dashBoardManagerSchema;