
async function userLatestClockInsResolver(_, __, { prismaUserId, prisma }) {
  if (!prismaUserId) throw new Error("Not authenticated");

  return prisma.clockIn.findMany({
    where: { userId: prismaUserId },
    orderBy: { clockInAt: "desc" },
    take: 10,
  });
}

module.exports = {
  Query: {
    userLatestClockIns: userLatestClockInsResolver,
  },
};
