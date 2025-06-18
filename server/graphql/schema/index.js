const { mergeTypeDefs } = require("@graphql-tools/merge");

// ====================
// BASE TYPES IMPORT
// ====================
const types = require("./types");

// ====================
// SCHEMA IMPORTS
// ====================
const authSchema = require("./auth");
const paymentSchema = require("./payment");
const workflowSchema = require("./workflow");
const pricingSchema = require("./pricing");
const documentSchema = require("./documents");

// Import additional schemas if they exist
let applicationsSchema, notificationsSchema, consultationsSchema, reportsSchema;

try {
  applicationsSchema = require("./applications");
} catch (e) {
  applicationsSchema = null;
}

try {
  notificationsSchema = require("./notifications");
} catch (e) {
  notificationsSchema = null;
}

try {
  consultationsSchema = require("./consultations");
} catch (e) {
  consultationsSchema = null;
}

try {
  reportsSchema = require("./reports");
} catch (e) {
  reportsSchema = null;
}

// ====================
// MERGE ALL SCHEMAS
// ====================
const schemas = [
  types,
  authSchema,
  paymentSchema,
  documentSchema,
  workflowSchema,
  pricingSchema,
];

if (applicationsSchema) schemas.push(applicationsSchema);
if (notificationsSchema) schemas.push(notificationsSchema);
if (consultationsSchema) schemas.push(consultationsSchema);
if (reportsSchema) schemas.push(reportsSchema);

const typeDefs = mergeTypeDefs(schemas);

module.exports = typeDefs;
