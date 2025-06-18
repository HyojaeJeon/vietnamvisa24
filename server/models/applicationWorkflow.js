const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const ApplicationWorkflow = sequelize.define(
    "ApplicationWorkflow",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "visa_applications",
          key: "id",
        },
      },
      templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "workflow_templates",
          key: "id",
        },
      },
      checklistStatus: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
      tableName: "application_workflows",
      timestamps: false,
      underscored: false,
    },
  );
  ApplicationWorkflow.associate = function (models) {
    ApplicationWorkflow.belongsTo(models.VisaApplication, {
      foreignKey: "applicationId",
      as: "application",
    });
    ApplicationWorkflow.belongsTo(models.WorkflowTemplate, {
      foreignKey: "templateId",
      as: "template",
    });
  };

  return ApplicationWorkflow;
};
