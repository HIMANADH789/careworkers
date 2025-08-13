async function staffCurrentlyClockedInResolver(_, __, { prisma }) {

  const careworkers = await prisma.user.findMany({
    where: { role: "CAREWORKER" },
    include: {
      clockIns: {
        orderBy: { clockInAt: "desc" },
        take: 1
      }
    }
  });

  const currentlyClockedIn = careworkers
    .filter(user => user.clockIns.length > 0 && user.clockIns[0].clockOutAt === null)
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      clockInAt: user.clockIns[0].clockInAt.toISOString()
    }));

  return currentlyClockedIn;
}

module.exports = { staffCurrentlyClockedInResolver };
