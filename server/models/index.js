

const { Sequelize } = require("sequelize");
const path = require("path");
const config = require("../config/config.js")[
  process.env.NODE_ENV || "development"
];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

const db = {};

// Import models
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Admin = require("./admin")(sequelize, Sequelize.DataTypes);
db.VisaApplication = require("./visaApplication")(
  sequelize,
  Sequelize.DataTypes,
);
db.Document = require("./document")(sequelize, Sequelize.DataTypes);
db.Notification = require("./notification")(sequelize, Sequelize.DataTypes);
db.Consultation = require("./consultation")(sequelize, Sequelize.DataTypes);
db.ApplicationStatusHistory = require("./applicationStatusHistory")(
  sequelize,
  Sequelize.DataTypes,
);
db.Payment = require("./payment")(sequelize, Sequelize.DataTypes);
db.WorkflowTemplate = require("./workflowTemplate")(sequelize, Sequelize.DataTypes);
db.ApplicationWorkflow = require("./applicationWorkflow")(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const models = db;

// ====================
// MODEL ASSOCIATIONS (관계 설정)
// ====================

// User ↔ VisaApplication (일대다)
models.User.hasMany(models.VisaApplication, { foreignKey: 'user_id', as: 'applications' });
models.VisaApplication.belongsTo(models.User, { foreignKey: 'user_id', as: 'applicant' });

// Admin ↔ VisaApplication (일대다 - 담당자)
models.Admin.hasMany(models.VisaApplication, { foreignKey: 'assigned_to', as: 'assignedApplications' });
models.VisaApplication.belongsTo(models.Admin, { foreignKey: 'assigned_to', as: 'assignedAdmin' });

// VisaApplication ↔ Document (일대다)
models.VisaApplication.hasMany(models.Document, { foreignKey: 'application_id', as: 'documents' });
models.Document.belongsTo(models.VisaApplication, { foreignKey: 'application_id', as: 'application' });

// VisaApplication ↔ ApplicationStatusHistory (일대다)
models.VisaApplication.hasMany(models.ApplicationStatusHistory, { foreignKey: 'application_id', as: 'statusHistory' });
models.ApplicationStatusHistory.belongsTo(models.VisaApplication, { foreignKey: 'application_id', as: 'application' });

// Admin ↔ ApplicationStatusHistory (일대다)
models.Admin.hasMany(models.ApplicationStatusHistory, { foreignKey: 'changed_by', as: 'statusChanges' });
models.ApplicationStatusHistory.belongsTo(models.Admin, { foreignKey: 'changed_by', as: 'changedBy' });

// VisaApplication ↔ Payment (일대다)
models.VisaApplication.hasMany(models.Payment, { foreignKey: 'application_id', as: 'payments' });
models.Payment.belongsTo(models.VisaApplication, { foreignKey: 'application_id', as: 'application' });

// WorkflowTemplate ↔ ApplicationWorkflow (일대다)
models.WorkflowTemplate.hasMany(models.ApplicationWorkflow, { foreignKey: 'template_id', as: 'workflows' });
models.ApplicationWorkflow.belongsTo(models.WorkflowTemplate, { foreignKey: 'template_id', as: 'template' });

// VisaApplication ↔ ApplicationWorkflow (일대다)
models.VisaApplication.hasMany(models.ApplicationWorkflow, { foreignKey: 'application_id', as: 'applicationWorkflows' });
models.ApplicationWorkflow.belongsTo(models.VisaApplication, { foreignKey: 'application_id', as: 'application' });

// Admin ↔ ApplicationWorkflow (일대다 - 담당자)
models.Admin.hasMany(models.ApplicationWorkflow, { foreignKey: 'assigned_to', as: 'assignedWorkflows' });
models.ApplicationWorkflow.belongsTo(models.Admin, { foreignKey: 'assigned_to', as: 'assignedTo' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
module.exports.models = models;
