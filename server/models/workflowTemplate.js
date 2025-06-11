
module.exports = (sequelize, DataTypes) => {
  const WorkflowTemplate = sequelize.define('WorkflowTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    visa_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    checklist: {
      type: DataTypes.JSON,
      allowNull: false
    },
    automation_rules: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'workflow_templates',
    timestamps: true,
    underscored: true
  });

  return WorkflowTemplate;
};
