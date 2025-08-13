

const { gql } = require('apollo-server');

const clockOutTypeDefs = gql`
  extend type Mutation {
    clockOut(lat: Float!, lng: Float!, note: String): ClockIn!
  }
`;

module.exports = clockOutTypeDefs;
