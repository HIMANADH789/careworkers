// schemas/clockInUsers.js
const { gql } = require('apollo-server');

const clockInUsers = gql`
  type ClockedInUser {
    id: ID!
    name: String!
    email: String!
    clockInAt: String!
  }

  extend type Query {
    staffCurrentlyClockedIn: [ClockedInUser!]!
  }
`;

module.exports = clockInUsers;
