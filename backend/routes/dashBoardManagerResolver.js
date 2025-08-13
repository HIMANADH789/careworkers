const dashBoardManagerResolver = {
  Query: {
    dashBoardManager: async (_, __, { prisma }) => {
      try {
        console.log('=== Dashboard resolver started ===');

 
        const careworkers = await prisma.user.findMany({
          where: { role: 'CAREWORKER' },
          select: { id: true, name: true, role: true },
        });
        console.log(`Found ${careworkers.length} CAREWORKER users`);

   
        const totalManagersCount = await prisma.user.count({
          where: { role: 'MANAGER' },
        });
        console.log('Total managers count:', totalManagersCount);

       
        const totalShifts = await prisma.clockIn.count({
          where: {
            user: { role: 'CAREWORKER' },
          },
        });
        console.log('Total shifts (CAREWORKER only):', totalShifts);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        console.log('One week ago:', oneWeekAgo);

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        const lastWeekClockIns = await prisma.clockIn.findMany({
          where: {
            clockInAt: { gte: oneWeekAgo },
            user: { role: 'CAREWORKER' },
          },
          include: { user: { select: { id: true, name: true, role: true } } },
          orderBy: { clockInAt: 'asc' },
        });
        console.log(`Found ${lastWeekClockIns.length} CAREWORKER clockIns from last week`);


        const validClockIns = lastWeekClockIns.filter(ci => ci.clockOutAt && ci.userId && ci.user && ci.user.role === 'CAREWORKER');

        console.log(`Found ${validClockIns.length} valid clockIns with clockOut data`);

   
        const userMap = {};
        careworkers.forEach(cw => userMap[cw.id] = cw);

  
        const dailyUsersMap = {};
        validClockIns.forEach(ci => {
          const date = ci.clockInAt.toISOString().split('T')[0];
          if (!dailyUsersMap[date]) dailyUsersMap[date] = new Set();
          dailyUsersMap[date].add(ci.userId);
        });

        const weeklyClockInCounts = Object.entries(dailyUsersMap).map(([date, users]) => ({
          date,
          count: users.size,
        }));

  
        const dailyDurationsMap = {};
        validClockIns.forEach(ci => {
          const date = ci.clockInAt.toISOString().split('T')[0];
          const durationHours = (new Date(ci.clockOutAt) - new Date(ci.clockInAt)) / (1000 * 60 * 60);
          if (!dailyDurationsMap[date]) dailyDurationsMap[date] = { totalDuration: 0, users: new Set() };
          dailyDurationsMap[date].totalDuration += durationHours;
          dailyDurationsMap[date].users.add(ci.userId);
        });

        const avgHoursPerDay = Object.entries(dailyDurationsMap).map(([date, { totalDuration, users }]) => ({
          date,
          avgHours: Math.round((users.size ? totalDuration / users.size : 0) * 100) / 100,
        }));


        const staffDurationsMap = {};
        careworkers.forEach(cw => staffDurationsMap[cw.id] = { totalHours: 0, shiftCount: 0, name: cw.name });

        validClockIns.forEach(ci => {
          const userId = ci.userId;
          const durationHours = (new Date(ci.clockOutAt) - new Date(ci.clockInAt)) / (1000 * 60 * 60);
          staffDurationsMap[userId].totalHours += durationHours;
          staffDurationsMap[userId].shiftCount += 1;
        });

        const totalHoursPerStaffLastWeek = Object.entries(staffDurationsMap).map(([staffId, { totalHours, name }]) => ({
          staffId,
          name,
          totalHours: Math.round(totalHours * 100) / 100,
        }));

        totalHoursPerStaffLastWeek.sort((a, b) => b.totalHours - a.totalHours);


        const roleDistribution = [
          {
            role: 'CAREWORKER',
            count: careworkers.length,
            percentage: Math.round((careworkers.length / (careworkers.length + totalManagersCount)) * 100),
          },
          {
            role: 'MANAGER',
            count: totalManagersCount,
            percentage: Math.round((totalManagersCount / (careworkers.length + totalManagersCount)) * 100),
          },
        ];


        const shiftDurations = validClockIns.map(ci => (new Date(ci.clockOutAt) - new Date(ci.clockInAt)) / (1000 * 60 * 60));

        const durationRanges = {
          '0-4 hours': shiftDurations.filter(d => d >= 0 && d < 4).length,
          '4-8 hours': shiftDurations.filter(d => d >= 4 && d < 8).length,
          '8-12 hours': shiftDurations.filter(d => d >= 8 && d < 12).length,
          '12+ hours': shiftDurations.filter(d => d >= 12).length,
        };

        const totalDurationShifts = shiftDurations.length;
        const shiftDurationDistribution = Object.entries(durationRanges).map(([range, count]) => ({
          range,
          count,
          percentage: totalDurationShifts ? Math.round((count / totalDurationShifts) * 100) : 0,
        }));

   
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const monthlyTrend = [];
        for (let i = 0; i < 4; i++) {
          const weekStart = new Date(fourWeeksAgo);
          weekStart.setDate(weekStart.getDate() + i * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);

          const weeklyUsers = new Set();
          validClockIns.forEach(ci => {
            if (ci.clockInAt >= weekStart && ci.clockInAt < weekEnd) weeklyUsers.add(ci.userId);
          });

          monthlyTrend.push({
            week: `Week ${i + 1}`,
            activeUsers: weeklyUsers.size,
          });
        }

        
        const hourlyClockIns = Array.from({ length: 24 }, () => 0);
        validClockIns.forEach(ci => {
          const hour = ci.clockInAt.getHours();
          hourlyClockIns[hour]++;
        });

        const peakHoursData = hourlyClockIns.map((count, hour) => ({
          hour: `${hour}:00`,
          clockIns: count,
        }));

     
        const todayClockIns = await prisma.clockIn.findMany({
          where: {
            clockInAt: { gte: startOfToday, lt: endOfToday },
            user: { role: 'CAREWORKER' },
          },
        });

        const currentlyActive = todayClockIns.filter(ci => !ci.clockOutAt).length;
        const completedShifts = todayClockIns.filter(ci => ci.clockOutAt).length;
        const totalTodayShifts = todayClockIns.length;

        const currentDayStatus = { currentlyActive, completedShifts, totalTodayShifts };

  
        const topPerformers = Object.entries(staffDurationsMap)
          .map(([staffId, { totalHours, shiftCount, name }]) => ({
            staffId,
            name,
            totalHours: Math.round(totalHours * 100) / 100,
            shiftCount,
            avgHoursPerShift: shiftCount ? Math.round((totalHours / shiftCount) * 100) / 100 : 0,
          }))
          .sort((a, b) => b.totalHours - a.totalHours)
          .slice(0, 10);

        console.log('Dashboard data prepared successfully (all CAREWORKERS included)');

        return {
          activeStaffCount: careworkers.length,
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
        };
      } catch (error) {
        console.error('Error in dashBoardManager resolver:', error);
        throw new Error(`Failed to fetch dashboard data: ${error.message}`);
      }
    },
  },
};

module.exports = dashBoardManagerResolver;
