const usersWithLastClockResolver = {
  Query: {
    usersWithLastClock: async (_, __, { prisma }) => {
      const users = await prisma.user.findMany({
        where: {
          role: "CAREWORKER"  
        },
        include: {
          clockIns: {
            orderBy: { clockInAt: 'desc' },
            take: 1, 
          },
        },
      });

      return users.map(user => {
        const lastClock = user.clockIns[0] || null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          lastClock: lastClock
            ? {
                clockInAt: lastClock.clockInAt,
                clockInLat: lastClock.clockInLat,
                clockInLng: lastClock.clockInLng,
                clockOutAt: lastClock.clockOutAt,
                clockOutLat: lastClock.clockOutLat,
                clockOutLng: lastClock.clockOutLng,
              }
            : null,
        };
      });
    },
  },
};

module.exports = usersWithLastClockResolver;
