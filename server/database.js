const { Sequelize } = require("sequelize");
const models = require("./models");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await models.sequelize.authenticate();
    console.log("✅ Connected to SQLite database via Sequelize");

    // Sync database (create tables if they don't exist)
    // Use force: true to recreate tables cleanly
    await models.sequelize.sync({ force: true });
    console.log("✅ Database tables synchronized successfully");

    // Create default admin
    await createDefaultAdmin();

    return models.sequelize;
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await models.Admin.findOne({
      where: { email: "admin@vietnamvisa.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123!", 10);
      await models.Admin.create({
        email: "admin@vietnamvisa.com",
        password: hashedPassword,
        name: "Super Admin",
        role: "SUPER_ADMIN",
      });
      console.log(
        "✅ Default admin created - Email: admin@vietnamvisa.com, Password: admin123!",
      );
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

const getDB = () => {
  return models;
};

module.exports = {
  connectDB,
  getDB,
  models,
};
