
module.exports = (sequelize, DataTypes) => {
  const ApplicationStatusHistory = sequelize.define('ApplicationStatusHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'visa_applications',
        key: 'id'
      }
    },
    previous_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    new_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'application_status_history',
    timestamps: true,
    createdAt: 'changed_at',
    updatedAt: false
  });

  ApplicationStatusHistory.associate = function(models) {
    ApplicationStatusHistory.belongsTo(models.VisaApplication, {
      foreignKey: 'application_id',
      as: 'application'
    });

    ApplicationStatusHistory.belongsTo(models.Admin, {
      foreignKey: 'changed_by',
      as: 'changedBy'
    });
  };

  return ApplicationStatusHistory;
};
