const clockHistoryByUserResolver = {
  Query: {
    clockHistoryByUser: async (_, { userId }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          clockIns: {
            orderBy: { clockInAt: 'desc' },
          },
        },
      });

      if (!user) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        records: user.clockIns.map(record => ({
          clockInAt: record.clockInAt,
          clockInLat: record.clockInLat,
          clockInLng: record.clockInLng,
          clockInNote: record.clockInNote,
          clockOutAt: record.clockOutAt,
          clockOutLat: record.clockOutLat,
          clockOutLng: record.clockOutLng,
          clockOutNote: record.clockOutNote,
        })),
      };
    },
  },
};

module.exports = clockHistoryByUserResolver;
