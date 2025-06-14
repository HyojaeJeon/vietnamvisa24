const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tokenVersion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.VisaApplication, {
      foreignKey: "user_id",
      as: "visaApplications",
    });

    // 가격표 관련 관계 추가
    User.hasMany(models.EVisaPrice, {
      foreignKey: "createdBy",
      as: "createdEVisaPrices",
    });
    User.hasMany(models.VisaRunPrice, {
      foreignKey: "createdBy",
      as: "createdVisaRunPrices",
    });
    User.hasMany(models.FastTrackPrice, {
      foreignKey: "createdBy",
      as: "createdFastTrackPrices",
    });
  };

  return User;
};
