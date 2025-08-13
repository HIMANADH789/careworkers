

const ClockOutResolver = {
  Mutation: {
    clockOut: async (_, { lat, lng, note }, { prismaUserId, prisma }) => {
      if (!prismaUserId) {
        throw new Error("Not authenticated");
      }


      const latestClockIn = await prisma.clockIn.findFirst({
        where: {
          userId: prismaUserId,
          clockOutAt: null,
        },
        orderBy: {
          clockInAt: 'desc',
        },
      });

      if (!latestClockIn) {
        throw new Error("No active clock-in found to clock out from");
      }

    
      const updatedClockIn = await prisma.clockIn.update({
        where: { id: latestClockIn.id },
        data: {
          clockOutAt: new Date(),
          clockOutLat: lat,
          clockOutLng: lng,
          clockOutNote: note || null,
        },
      });

      return updatedClockIn;
    },
  },
};

module.exports = ClockOutResolver;
