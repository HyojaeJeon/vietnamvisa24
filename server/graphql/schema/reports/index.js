
const { gql } = require("graphql-tag");

const reportsTypeDefs = gql`
  extend type Query {
    getReportsData: ReportsData!
  }
`;

module.exports = reportsTypeDefs;
