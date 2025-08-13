const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    userLatestClockIns: [ClockIn!]!
  }

  type ClockIn {
    id: ID!
    clockInAt: String!
    clockInLat: Float!
    clockInLng: Float!
    clockInNote: String
    clockOutAt: String
    clockOutLat: Float
    clockOutLng: Float
    clockOutNote: String
  }
`;
