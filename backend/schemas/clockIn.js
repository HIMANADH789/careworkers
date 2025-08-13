const { gql } = require('apollo-server');

const clockInTypeDefs = gql`
  type ClockIn {
    id: ID!
    userId: ID!
    clockInAt: String!
    clockInLat: Float!
    clockInLng: Float!
    clockInNote: String
    clockOutAt: String
    clockOutLat: Float
    clockOutLng: Float
    clockOutNote: String
  }

  type Mutation {
    clockIn(lat: Float!, lng: Float!, note: String): ClockIn!
  }
`;

module.exports= clockInTypeDefs