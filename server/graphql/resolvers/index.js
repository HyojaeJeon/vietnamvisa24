const { mergeResolvers } = require("@graphql-tools/merge");

const scalars = require("../schema/scalars");
const authResolvers = require("./auth");
const applicationsResolvers = require("./applications");
const documentsResolvers = require("./documents");
const consultationsResolvers = require("./consultations");
const paymentResolvers = require("./payment");
const workflowResolvers = require("./workflow");
const reportsResolvers = require("./reports");
const pricingResolvers = require("./pricing");

const resolvers = mergeResolvers([
  scalars,
  authResolvers,
  applicationsResolvers,
  documentsResolvers,
  consultationsResolvers,
  paymentResolvers,
  workflowResolvers,
  reportsResolvers,
  pricingResolvers,
]);

module.exports = resolvers;
