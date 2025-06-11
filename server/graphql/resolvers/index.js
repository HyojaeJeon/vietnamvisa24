const { mergeResolvers } = require('@graphql-tools/merge');

const authResolvers = require('./auth');
const adminResolvers = require('./admin');
const documentsResolvers = require('./documents');
const consultationsResolvers = require('./consultations');

const resolvers = mergeResolvers([
  authResolvers,
  adminResolvers,
  documentsResolvers,
  consultationsResolvers
]);

module.exports = resolvers;