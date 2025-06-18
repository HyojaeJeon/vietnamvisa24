const { Sequelize } = require("sequelize");
const path = require("path");
const config = require("../config/config.js")[
  process.env.NODE_ENV || "development"
];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else if (config.dialect === "sqlite") {
  // SQLite의 경우 database, username, password 파라미터가 필요하지 않음
  sequelize = new Sequelize(config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

console.log("🔧 Models - Sequelize initialized with:", config.dialect);

const db = {};

// Import models
db.User = require("./user")(sequelize);
db.VisaApplication = require("./visaApplication")(sequelize);
db.Document = require("./document")(sequelize);
db.Notification = require("./notification")(sequelize);
db.Consultation = require("./consultation")(sequelize);
db.ApplicationStatusHistory = require("./applicationStatusHistory")(sequelize);
db.Payment = require("./payment")(sequelize);
db.WorkflowTemplate = require("./workflowTemplate")(sequelize);
db.ApplicationWorkflow = require("./applicationWorkflow")(sequelize);

// 가격표 모델들 추가
db.EVisaPrice = require("./eVisaPrice")(sequelize);
db.VisaRunPrice = require("./visaRunPrice")(sequelize);
db.FastTrackPrice = require("./fastTrackPrice")(sequelize);

// 새로운 모델들 추가
db.AdditionalService = require("./AdditionalService")(sequelize);
db.ApplicationAdditionalService = require("./ApplicationAdditionalService")(
  sequelize,
);

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
