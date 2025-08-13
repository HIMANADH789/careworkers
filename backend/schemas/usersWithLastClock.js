const { gql } = require('apollo-server');

const usersWithLastClock = gql`
  type LastClockRecord {
    clockInAt: String
    clockInLat: Float
    clockInLng: Float
    clockOutAt: String
    clockOutLat: Float
    clockOutLng: Float
  }

  type UserWithLastClock {
    id: ID!
    name: String!
    email: String!
    lastClock: LastClockRecord
  }

  extend type Query {
    usersWithLastClock: [UserWithLastClock!]!
  }
`;

module.exports = usersWithLastClock;
