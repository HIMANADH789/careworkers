const ClockInResolver = {
  Mutation: {
    clockIn: async (_, { lat, lng, note }, { prismaUserId, prisma }) => {
      if (!prismaUserId) {
        throw new Error("Not authenticated");
      }
        
      const newClockIn = await prisma.clockIn.create({
        data: {
          userId: prismaUserId,
          clockInAt: new Date(),
          clockInLat: lat,
          clockInLng: lng,
          clockInNote: note || null,
          clockOutAt: null
        },
      });
      console.log(newClockIn)
      return newClockIn;
    },
  },
};

module.exports = ClockInResolver;
