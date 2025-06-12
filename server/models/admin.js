module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("SUPER_ADMIN", "MANAGER", "STAFF"),
        defaultValue: "STAFF",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "admins",
      timestamps: true,
      underscored: true,
    }
  );

  // 관계 정의: Admin -> Pricing Models
  Admin.associate = (models) => {
    Admin.hasMany(models.EVisaPrice, {
      foreignKey: "createdBy",
      as: "createdEVisaPrices",
    });
    Admin.hasMany(models.EVisaPrice, {
      foreignKey: "updatedBy",
      as: "updatedEVisaPrices",
    });
    Admin.hasMany(models.VisaRunPrice, {
      foreignKey: "createdBy",
      as: "createdVisaRunPrices",
    });
    Admin.hasMany(models.VisaRunPrice, {
      foreignKey: "updatedBy",
      as: "updatedVisaRunPrices",
    });
    Admin.hasMany(models.FastTrackPrice, {
      foreignKey: "createdBy",
      as: "createdFastTrackPrices",
    });
    Admin.hasMany(models.FastTrackPrice, {
      foreignKey: "updatedBy",
      as: "updatedFastTrackPrices",
    });
  };

  return Admin;
};
