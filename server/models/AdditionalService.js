module.exports = (sequelize, DataTypes) => {
  const AdditionalService = sequelize.define(
    "AdditionalService",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serviceId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment:
          "Unique service identifier like airport_pickup_sedan_district2",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "additional_services",
      timestamps: true,
      hooks: {
        beforeUpdate: (service, options) => {
          service.updatedAt = new Date();
        },
      },
    },
  );

  AdditionalService.associate = (models) => {
    AdditionalService.belongsToMany(models.VisaApplication, {
      through: "ApplicationAdditionalServices",
      foreignKey: "additionalServiceId",
      otherKey: "applicationId",
      as: "applications",
    });
  };

  return AdditionalService;
};
