require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const {authenticateUser} = require('./routes/auth');


const { clockStatusResolver } = require('./routes/clock');
const clockInResolver = require('./routes/clockIn');
const clockOutResolver = require('./routes/clockOut');
const clockOutTypeDefs = require('./schemas/clockOut');
const clockInTypeDefs = require('./schemas/clockIn');
const { staffCurrentlyClockedInResolver } = require('./routes/clockInUsers');

const clockInUsers = require('./schemas/clockInUsers');
const locationPerimeterTypeDefs = require('./schemas/locationPerimeter');
const locationPerimeterResolver = require('./routes/locationPerimeter');
const clockHistoryByUserTypeDefs = require('./schemas/clockHistoryByUser');
const clockHistoryByUserResolver = require('./routes/clockHistoryByUser');
const usersWithLastClockTypeDefs = require('./schemas/usersWithLastClock');
const usersWithLastClockResolver = require('./routes/usersWithLastClock');

const userLatestClockInsTypeDefs = require('./schemas/userLatestClockIns');
const userLatestClockInsResolver = require('./routes/userLatestClockIns');

const dashBoardManagerTypeDefs = require('./schemas/dashBoardManagerSchema');
const dashBoardManagerResolver = require('./routes/dashBoardManagerResolver');

const prisma = new PrismaClient();

const baseTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type ClockStatus {
    status: String!
    lastClockInId: ID
    clockInAt: String
    clockOutAt: String
  }

  input UpdateUserInput {
    name: String
  }

  type Query {
    me: User
    clockStatus(lat: Float!, lon: Float!): ClockStatus!
  }

  type Mutation {
    updateMe(data: UpdateUserInput!): User
  }
`;

const typeDefs = [
  baseTypeDefs,
  clockInTypeDefs,
  clockOutTypeDefs,
  locationPerimeterTypeDefs,
  clockInUsers,
  clockHistoryByUserTypeDefs,
  usersWithLastClockTypeDefs,
  userLatestClockInsTypeDefs,
  dashBoardManagerTypeDefs, 
];

const resolvers = {
  Query: {
    me: async (_, __, { prismaUserId, prisma }) => {
      if (!prismaUserId) return null;
      return prisma.user.findUnique({ where: { id: prismaUserId } });
    },
    clockStatus: clockStatusResolver,
    staffCurrentlyClockedIn: staffCurrentlyClockedInResolver,
    clockHistoryByUser: clockHistoryByUserResolver.Query.clockHistoryByUser,
    usersWithLastClock: usersWithLastClockResolver.Query.usersWithLastClock,
    ...userLatestClockInsResolver.Query,
    ...dashBoardManagerResolver.Query,
  },
  Mutation: {
    updateMe: async (_, { data }, { prismaUserId, prisma }) => {
      if (!prismaUserId) {
        throw new Error('Not authenticated');
      }
      return prisma.user.update({
        where: { id: prismaUserId },
        data: {
          name: data.name || undefined,
        },
      });
    },
    ...clockInResolver.Mutation,
    ...clockOutResolver.Mutation,
    ...locationPerimeterResolver.Mutation,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    try {
      const prismaUserId = await authenticateUser(req, prisma);
      console.log('Authenticated user id:', prismaUserId);
      return { prisma, prismaUserId };
    } catch (err) {
      console.error('Error in Apollo Server context:', err);
      throw err;
    }
  },
  formatError: (err) => {
    console.error('GraphQL error:', err);
    return err;
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
