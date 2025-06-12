const { Sequelize } = require("sequelize");
const models = require("./models");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await models.sequelize.authenticate();
    console.log("✅ Connected to SQLite database via Sequelize"); // Sync database (create tables if they don't exist)
    // Use force: false to keep existing data
    await models.sequelize.sync({ force: false });
    console.log("✅ Database tables synchronized successfully");

    // Wait a bit to ensure tables are fully created
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create default admin after tables are created
    await createDefaultAdmin();

    return models.sequelize;
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    // Check if Admin model exists and is ready
    if (!models.Admin) {
      console.error("❌ Admin model not found");
      return;
    }

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
        is_active: true,
      });
      console.log("✅ Default admin created - Email: admin@vietnamvisa.com, Password: admin123!");
    } else {
      console.log("✅ Default admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
    // Don't throw the error to prevent server startup failure
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
