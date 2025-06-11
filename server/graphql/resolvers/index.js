const { mergeResolvers } = require('@graphql-tools/merge');

const authResolvers = require('./auth');
const adminResolvers = require('./admin');
const documentsResolvers = require('./documents');
const consultationsResolvers = require('./consultations');
const paymentResolvers = require('./payment');
const workflowResolvers = require('./workflow');
const reportsResolvers = require('./reports');

const resolvers = mergeResolvers([
  authResolvers,
  adminResolvers,
  documentsResolvers,
  consultationsResolvers,
  paymentResolvers,
  workflowResolvers,
  reportsResolvers
]);

module.exports = resolvers;