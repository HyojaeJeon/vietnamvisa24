const { Sequelize } = require("sequelize");
const path = require("path");
const config = require("../config/config.js")[process.env.NODE_ENV || "development"];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

// Import models
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Admin = require("./admin")(sequelize, Sequelize.DataTypes);
db.VisaApplication = require("./visaApplication")(sequelize, Sequelize.DataTypes);
db.Document = require("./document")(sequelize, Sequelize.DataTypes);
db.Notification = require("./notification")(sequelize, Sequelize.DataTypes);
db.Consultation = require("./consultation")(sequelize, Sequelize.DataTypes);
db.ApplicationStatusHistory = require("./applicationStatusHistory")(sequelize, Sequelize.DataTypes);
db.Payment = require("./payment")(sequelize, Sequelize.DataTypes);
db.WorkflowTemplate = require("./workflowTemplate")(sequelize, Sequelize.DataTypes);
db.ApplicationWorkflow = require("./applicationWorkflow")(sequelize, Sequelize.DataTypes);
db.RefreshToken = require("./refreshToken")(sequelize, Sequelize.DataTypes);

// 가격표 모델들 추가
db.EVisaPrice = require("./eVisaPrice")(sequelize, Sequelize.DataTypes);
db.VisaRunPrice = require("./visaRunPrice")(sequelize, Sequelize.DataTypes);
db.FastTrackPrice = require("./fastTrackPrice")(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const models = db;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
module.exports.models = models;
