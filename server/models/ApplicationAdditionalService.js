module.exports = (sequelize, DataTypes) => {
  const ApplicationAdditionalService = sequelize.define(
    "ApplicationAdditionalService",
    {
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "visa_applications",
          key: "id",
        },
      },
      additionalServiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "additional_services",
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "application_additional_services",
      timestamps: true,
    },
  );

  return ApplicationAdditionalService;
};
