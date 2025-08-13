const { gql } = require('apollo-server');

module.exports = gql`
  type LocationPerimeter {
    id: ID!
    name: String!
    centerLat: Float!
    centerLng: Float!
    radiusKm: Float!
    createdById: String
  }

  extend type Query {
    locationPerimeter: LocationPerimeter
  }

  extend type Mutation {
    upsertLocationPerimeter(
      name: String!
      centerLat: Float!
      centerLng: Float!
      radiusKm: Float!
    ): LocationPerimeter!
  }
`;
