const { getDistanceFromLatLonInMeters } = require("../utils/distance");
const getAllowedDistance = require("./getAllowedDistance");

async function clockStatusResolver(_, { lat, lon }, { prismaUserId, prisma }) {
  if (!prismaUserId) throw new Error("Not authenticated");
  if (!lat || !lon) throw new Error("Location not provided");

  const OFFICE_LAT = getAllowedDistance.lat;
  const OFFICE_LON = getAllowedDistance.lon;
  const ALLOWED_RADIUS_METERS = getAllowedDistance.radius;

  if (OFFICE_LAT == null || OFFICE_LON == null || ALLOWED_RADIUS_METERS == null) {
    throw new Error("Allowed location perimeter not configured");
  }

  const distance = getDistanceFromLatLonInMeters(lat, lon, OFFICE_LAT, OFFICE_LON);
  if (distance > ALLOWED_RADIUS_METERS) {
    return { status: "NOT_IN_PERIMETER" };
  }

  const lastClockIn = await prisma.clockIn.findFirst({
    where: { userId: prismaUserId },
    orderBy: { clockInAt: "desc" },
  });

  if (!lastClockIn) return { status: "CAN_CLOCK_IN" };

  if (!lastClockIn.clockOutAt) {
    return {
      status: "CAN_CLOCK_OUT",
      lastClockInId: lastClockIn.id,
      clockInAt: lastClockIn.clockInAt?.toISOString(),
      clockOutAt: null
    };
  }

  return {
    status: "CAN_CLOCK_IN",
    lastClockInId: lastClockIn.id,
    clockInAt: lastClockIn.clockInAt?.toISOString(),
    clockOutAt: lastClockIn.clockOutAt?.toISOString()
  };
}

module.exports = { clockStatusResolver };
