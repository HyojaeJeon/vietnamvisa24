const { mergeResolvers } = require("@graphql-tools/merge");

const authResolvers = require("./auth");
const adminResolvers = require("./admin");
const applicationsResolvers = require("./applications");
const documentsResolvers = require("./documents");
const consultationsResolvers = require("./consultations");
const paymentResolvers = require("./payment");
const workflowResolvers = require("./workflow");
const reportsResolvers = require("./reports");
const pricingResolvers = require("./pricing");

const resolvers = mergeResolvers([
  authResolvers,
  adminResolvers,
  applicationsResolvers,
  documentsResolvers,
  consultationsResolvers,
  paymentResolvers,
  workflowResolvers,
  reportsResolvers,
  pricingResolvers,
]);

module.exports = resolvers;
 