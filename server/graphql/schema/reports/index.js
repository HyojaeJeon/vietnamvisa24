
const { gql } = require("graphql-tag");

const reportsTypeDefs = gql`
  extend type Query {
    reportsData(dateRange: String!): ReportsData!
  }
`;

module.exports = reportsTypeDefs;
