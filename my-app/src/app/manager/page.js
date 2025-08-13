"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Heading,
  Text,
  Notification,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Stack,
  Meter,
} from "grommet";
import NavBar from "@/components/NavBar";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";

const DASHBOARD_QUERY = gql`
  query GetManagerDashboard {
    dashBoardManager {
      activeStaffCount
      totalManagersCount
      totalShifts
      weeklyClockInCounts {
        date
        count
      }
      avgHoursPerDay {
        date
        avgHours
      }
      totalHoursPerStaffLastWeek {
        staffId
        name
        totalHours
      }
      roleDistribution {
        role
        count
        percentage
      }
      shiftDurationDistribution {
        range
        count
        percentage
      }
      monthlyTrend {
        week
        activeUsers
      }
      peakHoursData {
        hour
        clockIns
      }
      currentDayStatus {
        currentlyActive
        completedShifts
        totalTodayShifts
      }
      topPerformers {
        staffId
        name
        totalHours
        shiftCount
        avgHoursPerShift
      }
    }
  }
`;

const COLORS = {
  primary: "#3B82F6", 
  secondary: "#8B5CF6", 
  accent: "#10B981", // Emerald
  warning: "#F59E0B", 
  danger: "#EF4444", 
  info: "#06B6D4",
  success: "#22C55E", 
  orange: "#F97316",
  pink: "#EC4899", // Pink
  indigo: "#6366F1", 
  
 
  gradient: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"],
  pieChart: [
    "#3B82F6", 
    "#10B981",
    "#8B5CF6", // Purple
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#EC4899"  // Pink
  ],
  

  charts: {
    area: "#06B6D4",
    areaGradient: "rgba(6, 182, 212, 0.1)",
    line: "#8B5CF6",
    bar: "#3B82F6",
    composed1: "#10B981",
    composed2: "#F59E0B",
  },
  
  careworker: "#10B981",
  otherRoles: "#3B82F6", // Blue color for other roles
};

const StatCard = ({ title, value, subtitle, color, icon, gradient = false }) => (
  <Card 
    background={gradient ? {
      image: `linear-gradient(135deg, ${color}15, ${color}05)`
    } : {
      color: "white",
      opacity: 0.98
    }}
    elevation="medium"
    round="medium"
    pad="medium"
    height="small"
    style={{
      border: `3px solid ${color}25`,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    }}
    hoverIndicator={{
      background: { 
        image: `linear-gradient(135deg, ${color}20, ${color}10)` 
      },
      elevation: "large",
      transform: "translateY(-2px)",
    }}
  >
    <CardBody>
      <Box direction="row" justify="between" align="center">
        <Box flex>
          <Text 
            size="small" 
            color="dark-3" 
            weight="600" 
            margin={{ bottom: "xsmall" }}
            style={{ letterSpacing: "0.5px" }}
          >
            {title}
          </Text>
          <Text 
            size="xxlarge" 
            weight="bold" 
            color={color}
            style={{ 
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: "1.1"
            }}
          >
            {value}
          </Text>
          {subtitle && (
            <Text size="xsmall" color="dark-5" margin={{ top: "xxsmall" }}>
              {subtitle}
            </Text>
          )}
        </Box>
        {icon && (
          <Box 
            background={{ 
              image: `linear-gradient(135deg, ${color}25, ${color}35)` 
            }} 
            round="full" 
            pad="medium"
            style={{ 
              minWidth: "56px", 
              minHeight: "56px",
              boxShadow: `0 8px 25px ${color}20`
            }}
            align="center"
            justify="center"
            animation={{
              type: "pulse",
              duration: 3000,
              size: "small"
            }}
          >
            <Text size="xlarge" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>
              {icon}
            </Text>
          </Box>
        )}
      </Box>
    </CardBody>
  </Card>
);


const ChartContainer = ({ title, children, height = 400, description, fullWidth = false }) => (
  <Box
    background={{
      color: "white",
      opacity: 0.98
    }}
    pad="large"
    round="medium"
    elevation="medium"
    style={{
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "2px solid #F1F5F9",
      backdropFilter: "blur(10px)",
      position: "relative",
      overflow: "hidden",
      ...(fullWidth && { gridColumn: "1 / -1" })
    }}
    hoverIndicator={{ 
      elevation: "large",
      border: "2px solid #E2E8F0"
    }}
  >
 
    <Box
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "100px",
        height: "100px",
        background: `linear-gradient(45deg, ${COLORS.primary}05, transparent)`,
        borderRadius: "0 0 0 100px",
        zIndex: 0
      }}
    />
    
    <Box margin={{ bottom: "medium" }} style={{ position: "relative", zIndex: 1 }}>
      <Heading 
        level={3} 
        margin="none" 
        color={COLORS.primary}
        style={{
          fontWeight: "700",
          letterSpacing: "-0.5px",
          fontSize: "1.5rem"
        }}
      >
        {title}
      </Heading>
      {description && (
        <Text 
          size="medium" 
          color="dark-4" 
          margin={{ top: "small" }}
          style={{ lineHeight: "1.4" }}
        >
          {description}
        </Text>
      )}
    </Box>
    
    <Box 
      height={`${height}px`} 
      style={{ position: "relative", zIndex: 1 }}
    >
      {children}
    </Box>
  </Box>
);


const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, role, count, percentage, index }) => {
  const RADIAN = Math.PI / 180;
  

  const labelRadius = outerRadius + 40;
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  const isCareworker = role.toLowerCase().includes('careworker') || role.toLowerCase().includes('care worker');
  const displayRole = isCareworker ? 'Careworker' : role;


  const textAnchor = x > cx ? 'start' : 'end';
  
  return (
    <g>
      <text
        x={x}
        y={y - 8}
        fill={isCareworker ? COLORS.careworker : COLORS.otherRoles}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
      >
        {displayRole}
      </text>
      <text
        x={x}
        y={y + 8}
        fill="#64748B"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {count} ({percentage?.toFixed(1)}%)
      </text>
    </g>
  );
};

const customTooltipStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  padding: "12px 16px",
  fontSize: "14px",
  backdropFilter: "blur(10px)",
};

export default function ManagerDashboardPage() {
  const { data, loading, error } = useQuery(DASHBOARD_QUERY);

  if (loading)
    return (
      <Box fill align="center" justify="center" background="#f0f9ff">
        <Box
          animation={{ type: "pulse", duration: 2000 }}
          background={{
            image: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
          }}
          round="full"
          pad="large"
          margin={{ bottom: "medium" }}
          style={{
            boxShadow: `0 20px 25px ${COLORS.primary}30`
          }}
        >
          <Text color="white" size="xlarge" weight="bold">⏳</Text>
        </Box>
        <Text size="xlarge" color={COLORS.primary} weight="bold">
          Loading Dashboard Analytics...
        </Text>
      </Box>
    );

  if (error)
    return (
      <Box fill align="center" justify="center" background="#fef2f2">
        <Notification
          status="critical"
          message={`Error loading dashboard: ${error.message}`}
          margin="medium"
        />
      </Box>
    );

  const {
    activeStaffCount,
    totalManagersCount,
    totalShifts,
    weeklyClockInCounts,
    avgHoursPerDay,
    totalHoursPerStaffLastWeek,
    roleDistribution,
    shiftDurationDistribution,
    monthlyTrend,
    peakHoursData,
    currentDayStatus,
    topPerformers,
  } = data?.dashBoardManager || {};

  const totalStaff = activeStaffCount + totalManagersCount;
  const activePercentage = totalStaff ? Math.round((activeStaffCount / totalStaff) * 100) : 0;
  
  const combinedTrendData = weeklyClockInCounts?.map((day, index) => ({
    ...day,
    avgHours: avgHoursPerDay?.[index]?.avgHours || 0,
  })) || [];

  const topPerformersChart = topPerformers?.slice(0, 8).map(performer => ({
    ...performer,
    efficiency: Math.round((performer.totalHours / performer.shiftCount) * 10) / 10
  })) || [];

  return (
    <RoleProtectedRoute allowedRoles={["MANAGER"]}>
      <Box
        fill
        background={{
          color: "background",
          dark: false,
          image: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0f9ff 100%)",
        }}
        style={{ 
          minHeight: "100vh", 
          position: "relative", 
          overflow: "auto",
        }}
      >
        {/* Fixed Navigation */}
        <Box
          fill="horizontal"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
          elevation="small"
        >
          <NavBar
            items={[
              { name: "Dashboard", url: "/manager" },
              { name: "All Staff", url: "/manager/all-staff" },
              { name: "Clocked In Staff", url: "/manager/clocked-in-staff" },
              { name: "Settings", url: "/manager/settings" },
            ]}
          />
        </Box>

        <Box pad="large" gap="large">
          <Box align="center" margin={{ vertical: "large" }}>
            <Heading
              level={1}
              margin="none"
              textAlign="center"
              style={{
                color: COLORS.primary,
                fontWeight: 800,
                fontSize: "3rem",
                letterSpacing: "-2px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              }}
            >
              📊 Dashboard
            </Heading>
          </Box>


          <Grid
            columns={{ count: "fit", size: ["medium", "medium"] }}
            gap="large"
            margin={{ bottom: "large" }}
          >
            <StatCard
              title="Active Staff"
              value={activeStaffCount}
              subtitle={`${activePercentage}% of total staff`}
              color={COLORS.primary}
              icon="👥"
              gradient
            />
            <StatCard
              title="Currently Active"
              value={currentDayStatus?.currentlyActive || 0}
              subtitle="Staff clocked in now"
              color={COLORS.success}
              icon="🟢"
              gradient
            />
            <StatCard
              title="Completed Today"
              value={currentDayStatus?.completedShifts || 0}
              subtitle="Shifts finished today"
              color={COLORS.warning}
              icon="✅"
              gradient
            />
            <StatCard
              title="Total Shifts"
              value={totalShifts}
              subtitle="All time record"
              color={COLORS.secondary}
              icon="📈"
              gradient
            />
          </Grid>

          <Grid
            columns={{ count: "fit", size: "large" }}
            gap="large"
            margin={{ bottom: "large" }}
          >

            <ChartContainer
              title="📈 Weekly Performance Overview"
              description="Daily clock-ins and average hours worked with trend analysis"
              height={400}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.charts.composed1} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.charts.composed1} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke={COLORS.primary}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke={COLORS.charts.composed1}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke={COLORS.charts.composed2}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <ReTooltip contentStyle={customTooltipStyle} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    fill="url(#colorCount)"
                    stroke={COLORS.charts.composed1}
                    strokeWidth={3}
                    name="Daily Clock-ins"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgHours"
                    stroke={COLORS.charts.composed2}
                    strokeWidth={4}
                    dot={{ 
                      fill: COLORS.charts.composed2, 
                      strokeWidth: 3, 
                      r: 8,
                      stroke: "#fff"
                    }}
                    activeDot={{ 
                      r: 10, 
                      stroke: COLORS.charts.composed2, 
                      strokeWidth: 3,
                      fill: "#fff"
                    }}
                    name="Avg Hours"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer
              title="🕐 Peak Activity Hours"
              description="Clock-in patterns throughout the day with activity intensity"
              height={400}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.charts.bar} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={COLORS.charts.bar} stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke={COLORS.primary}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke={COLORS.primary}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <ReTooltip contentStyle={customTooltipStyle} />
                  <Bar 
                    dataKey="clockIns" 
                    fill="url(#colorBar)"
                    radius={[6, 6, 0, 0]}
                    name="Clock-ins"
                    style={{
                      filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          {/* Enhanced Team Composition - Full Width */}
          <ChartContainer
            title="👥 Team Composition Analysis"
            description="Distribution of staff roles with detailed breakdown"
            height={500}
            fullWidth={true}
          >
            <Grid columns={{ count: "fit", size: ["auto", "large"] }} gap="large" fill>
              {/* Enhanced Pie Chart */}
              <Box align="center" justify="center" height="450px">
                <ResponsiveContainer width={500} height={450}>
                  <PieChart margin={{ top: 40, right: 100, bottom: 40, left: 100 }}>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={6}
                      dataKey="count"
                      stroke="#fff"
                      strokeWidth={3}
                    >
                      {roleDistribution?.map((entry, index) => {
                        const isCareworker = entry.role.toLowerCase().includes('careworker') || 
                                           entry.role.toLowerCase().includes('care worker');
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={isCareworker ? COLORS.careworker : COLORS.otherRoles}
                            style={{
                              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                            }}
                          />
                        );
                      })}
                    </Pie>
                    <ReTooltip 
                      contentStyle={customTooltipStyle}
                      formatter={(value, name, props) => [
                        `${value} staff members`,
                        props.payload.role.toLowerCase().includes('careworker') || props.payload.role.toLowerCase().includes('care worker')
                          ? 'Careworker'
                          : props.payload.role
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
             
            </Grid>
          </ChartContainer>


          <Grid
            columns={{ count: "fit", size: "large" }}
            gap="large"
            margin={{ bottom: "large" }}
          >
            {/* Enhanced Top Performers */}
            <ChartContainer
              title="🏆 Top Performers This Month"
              description="Staff ranked by total hours worked and efficiency"
              height={450}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="horizontal"
                  data={topPerformersChart}
                  margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="performerGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={110}
                    tick={{ fontSize: 12, fontWeight: 500 }}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <ReTooltip contentStyle={customTooltipStyle} />
                  <Bar 
                    dataKey="totalHours" 
                    fill="url(#performerGradient)"
                    radius={[0, 6, 6, 0]}
                    name="Total Hours"
                    style={{
                      filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            
            <ChartContainer
              title="📊 Monthly Activity Trend"
              description="Weekly active user patterns and growth analysis"
              height={450}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.charts.area} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.charts.area} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke={COLORS.primary}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke={COLORS.primary}
                    axisLine={{ strokeWidth: 2 }}
                  />
                  <ReTooltip contentStyle={customTooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    stroke={COLORS.charts.area}
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorActiveUsers)"
                    name="Active Users"
                    dot={{ 
                      fill: COLORS.charts.area, 
                      strokeWidth: 3, 
                      r: 6,
                      stroke: "#fff"
                    }}
                    activeDot={{ 
                      r: 8, 
                      stroke: COLORS.charts.area, 
                      strokeWidth: 3,
                      fill: "#fff"
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Grid>

          {/* Enhanced Performance Table */}
          <ChartContainer
            title="📋 Detailed Staff Performance Analytics"
            description="Comprehensive view of all top performers with efficiency metrics"
            height={500}
            fullWidth={true}
          >
            <Box overflow={{ horizontal: "auto" }}>
              <Box
                as="table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr 
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.primary}05)`,
                      borderBottom: `3px solid ${COLORS.primary}30`
                    }}
                  >
                    {["Rank", "                 Staff Name",  " Total Hours", "   Shifts", "Avg Hours", "Efficiency"].map((header, index) => (
                      <th
                        key={header}
                        style={{
                          padding: "16px 20px",
                          textAlign: index === 1 ? "left" : "center",
                          fontWeight: "700",
                          color: COLORS.primary,
                          letterSpacing: "0.5px",
                          fontSize: "15px"
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topPerformers?.slice(0, 10).map((performer, index) => (
                    <tr
                      key={performer.staffId}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        borderBottom: "1px solid #e2e8f0"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#e0f2fe";
                        e.currentTarget.style.transform = "scale(1.01)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8fafc";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <Box
                          background={
                            index < 3 
                              ? { 
                                  image: `linear-gradient(135deg, ${COLORS.warning}30, ${COLORS.warning}20)` 
                                }
                              : { 
                                  image: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.primary}10)` 
                                }
                          }
                          round="full"
                          pad={{ horizontal: "medium", vertical: "small" }}
                          width="fit-content"
                          style={{ 
                            margin: "0 auto",
                            border: `2px solid ${index < 3 ? COLORS.warning : COLORS.primary}40`
                          }}
                        >
                          <Text 
                            weight="bold" 
                            size="medium"
                            color={index < 3 ? COLORS.warning : COLORS.primary}
                          >
                            {index < 3 ? `🏆 #${index + 1}` : `#${index + 1}`}
                          </Text>
                        </Box>
                      </td>
                      <td style={{ 
                        padding: "16px 20px", 
                        fontWeight: "600",
                        fontSize: "15px",
                        color: COLORS.primary
                      }}>
                        {performer.name}
                      </td>
                      <td style={{ 
                        padding: "16px 20px", 
                        textAlign: "center", 
                        fontWeight: "600",
                        fontSize: "15px",
                        color: COLORS.success
                      }}>
                        {performer.totalHours}h
                      </td>
                      <td style={{ 
                        padding: "16px 20px", 
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}>
                        {performer.shiftCount}
                      </td>
                      <td style={{ 
                        padding: "16px 20px", 
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}>
                        {performer.avgHoursPerShift}h
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <Box align="center" gap="xsmall">
                          <Box width="80px" style={{ margin: "0 auto" }}>
                            <Meter
                              values={[
                                {
                                  value: Math.min(performer.avgHoursPerShift * 10, 100),
                                  color: performer.avgHoursPerShift > 7 
                                    ? COLORS.success 
                                    : performer.avgHoursPerShift > 5 
                                      ? COLORS.warning 
                                      : COLORS.danger,
                                },
                              ]}
                              thickness="medium"
                              size="small"
                              round
                              style={{
                                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                              }}
                            />
                          </Box>
                          <Text 
                            size="xsmall" 
                            weight="600"
                            color={
                              performer.avgHoursPerShift > 7 
                                ? COLORS.success 
                                : performer.avgHoursPerShift > 5 
                                  ? COLORS.warning 
                                  : COLORS.danger
                            }
                          >
                            {Math.round(performer.avgHoursPerShift * 10)}%
                          </Text>
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          </ChartContainer>

          {/* Enhanced Footer Summary */}
          <Box
            background={{
              image: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
            }}
            pad="large"
            round="medium"
            elevation="small"
            margin={{ top: "large" }}
            align="center"
            style={{
              border: `2px solid ${COLORS.primary}20`,
              backdropFilter: "blur(10px)"
            }}
          >
            <Grid columns={{ count: "fit", size: "medium" }} gap="large" fill>
              <Box align="center">
                <Text size="large" weight="bold" color={COLORS.primary}>
                  📅 Last Updated
                </Text>
                <Text size="medium" color="dark-4" textAlign="center">
                  {new Date().toLocaleString()}
                </Text>
              </Box>
              <Box align="center">
                <Text size="large" weight="bold" color={COLORS.success}>
                  📊 Total Data Points
                </Text>
                <Text size="medium" color="dark-4" textAlign="center">
                  {totalShifts} shifts • {totalStaff} staff members
                </Text>
              </Box>
              <Box align="center">
                <Text size="large" weight="bold" color={COLORS.secondary}>
                  ⚡ System Status
                </Text>
                <Box direction="row" align="center" gap="small">
                  <Box 
                    background={COLORS.success}
                    round="full"
                    width="8px"
                    height="8px"
                    animation={{
                      type: "pulse",
                      duration: 2000,
                      size: "small"
                    }}
                  />
                  <Text size="medium" color="dark-4">
                    All systems operational
                  </Text>
                </Box>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Box>
    </RoleProtectedRoute>
  );
}