module.exports = (sequelize, DataTypes) => {
  const WorkflowTemplate = sequelize.define(
    "WorkflowTemplate",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      visa_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      checklist: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      automation_rules: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      is_active: {
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
      tableName: "workflow_templates",
      timestamps: false,
      underscored: false,
    },
  );

  return WorkflowTemplate;
};
