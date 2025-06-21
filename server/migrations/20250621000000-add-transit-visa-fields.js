"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("visa_applications", "transitPeopleCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("visa_applications", "transitVehicleType", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "visa_applications",
      "transitPeopleCount",
    );
    await queryInterface.removeColumn(
      "visa_applications",
      "transitVehicleType",
    );
  },
};
