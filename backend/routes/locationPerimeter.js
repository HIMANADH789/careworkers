const locationPerimeterResolver = {
  Query: {
    locationPerimeter: async (_, __, { prisma }) => {
      return prisma.locationPerimeter.findFirst();
    }
  },
  Mutation: {
    upsertLocationPerimeter: async (_, args, { prisma, prismaUserId }) => {
      if (!prismaUserId) {
        throw new Error("Not authenticated");
      }

      const existing = await prisma.locationPerimeter.findFirst();

      if (!existing) {
        return prisma.locationPerimeter.create({
          data: {
            name: args.name,
            centerLat: args.centerLat,
            centerLng: args.centerLng,
            radiusKm: args.radiusKm,
            createdById: prismaUserId
          }
        });
      } else {
        return prisma.locationPerimeter.update({
          where: { id: existing.id },
          data: {
            name: args.name,
            centerLat: args.centerLat,
            centerLng: args.centerLng,
            radiusKm: args.radiusKm,
            createdById: prismaUserId
          }
        });
      }
    }
  }
};

module.exports = locationPerimeterResolver;
