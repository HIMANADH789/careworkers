const { gql } = require('apollo-server');

const clockHistoryByUser = gql`
  type ClockRecord {
    clockInAt: String!
    clockInLat: Float
    clockInLng: Float
    clockInNote: String
    clockOutAt: String
    clockOutLat: Float
    clockOutLng: Float
    clockOutNote: String
  }

  type UserClockHistory {
    id: ID!
    name: String!
    email: String!
    records: [ClockRecord!]!
  }

  extend type Query {
    clockHistoryByUser(userId: ID!): UserClockHistory
  }
`;

module.exports = clockHistoryByUser;
