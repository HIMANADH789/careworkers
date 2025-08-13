
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllowedDistance = {
  lat: 17.554356 ,
  lon: 80.619736,
  radius: 10000000
};

async function loadAllowedDistance() {
  try {
    const perimeter = await prisma.locationPerimeter.findFirst();

    if (perimeter) {
      getAllowedDistance.lat = perimeter.centerLat;
      getAllowedDistance.lon = perimeter.centerLng;
      getAllowedDistance.radius = perimeter.radiusKm * 1000; 
      console.log('📍 Loaded allowed distance from DB:', getAllowedDistance);
    } else {
      console.warn('⚠ No locationPerimeter found in DB.');
    }
  } catch (err) {
    console.error('❌ Error loading allowed distance:', err);
  }
}


loadAllowedDistance();


setInterval(loadAllowedDistance, 60 * 1000);

module.exports =  getAllowedDistance ;
