const fs = require("fs");
const path = require("path");
const { connectDB } = require("../database");

async function runSeeders() {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected for seeding");

    // Get all seeder files
    const seedersPath = __dirname;
    const files = fs
      .readdirSync(seedersPath)
      .filter((file) => file.endsWith(".js") && file !== "index.js")
      .sort();

    console.log("📂 Found seeder files:", files);

    // Import Sequelize
    const { sequelize } = require("../models");

    // Run each seeder
    for (const file of files) {
      console.log(`🔄 Running seeder: ${file}`);
      const seeder = require(path.join(seedersPath, file));

      if (seeder.up) {
        await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Completed seeder: ${file}`);
      }
    }

    console.log("🎉 All seeders completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeeders();
