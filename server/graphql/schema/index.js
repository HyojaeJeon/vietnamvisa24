const { mergeTypeDefs } = require("@graphql-tools/merge");

// ====================
// BASE TYPES IMPORT
// ====================
const types = require("./types");

// ====================
// SCHEMA IMPORTS
// ====================
const authSchema = require("./auth");
const adminSchema = require("./admin");
const paymentSchema = require("./payment");
const workflowSchema = require("./workflow");
const pricingSchema = require("./pricing");

// Import additional schemas if they exist
let applicationsSchema, documentsSchema, notificationsSchema, consultationsSchema, reportsSchema;

try {
  applicationsSchema = require("./applications");
} catch (e) {
  applicationsSchema = null;
}

try {
  documentsSchema = require("./documents");
} catch (e) {
  documentsSchema = null;
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
const schemas = [types, authSchema, adminSchema, paymentSchema, workflowSchema, pricingSchema];

if (applicationsSchema) schemas.push(applicationsSchema);
if (documentsSchema) schemas.push(documentsSchema);
if (notificationsSchema) schemas.push(notificationsSchema);
if (consultationsSchema) schemas.push(consultationsSchema);
if (reportsSchema) schemas.push(reportsSchema);

const typeDefs = mergeTypeDefs(schemas);

module.exports = typeDefs;
