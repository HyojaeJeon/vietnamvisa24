
const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('../config/database.js')[process.env.NODE_ENV || 'development'];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

// Import models
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Admin = require('./admin')(sequelize, Sequelize.DataTypes);
db.VisaApplication = require('./visaApplication')(sequelize, Sequelize.DataTypes);
db.Document = require('./document')(sequelize, Sequelize.DataTypes);
db.Notification = require('./notification')(sequelize, Sequelize.DataTypes);
db.Consultation = require('./consultation')(sequelize, Sequelize.DataTypes);
db.ApplicationStatusHistory = require('./applicationStatusHistory')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
