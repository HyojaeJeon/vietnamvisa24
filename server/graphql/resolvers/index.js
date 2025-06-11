
const { merge } = require("lodash");

// ====================
// RESOLVER IMPORTS
// ====================
const authResolvers = require('./auth');
const adminResolvers = require('./admin');
const paymentResolvers = require('./payment');
const workflowResolvers = require('./workflow');

// Import additional resolvers if they exist
let documentsResolvers;

try {
  documentsResolvers = require('./documents');
} catch (e) {
  documentsResolvers = {};
}

const resolvers = merge(
  authResolvers, 
  adminResolvers, 
  paymentResolvers, 
  workflowResolvers,
  documentsResolvers
);

module.exports = resolvers;
