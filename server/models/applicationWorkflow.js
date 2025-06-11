
module.exports = (sequelize, DataTypes) => {
  const ApplicationWorkflow = sequelize.define('ApplicationWorkflow', {
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
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workflow_templates',
        key: 'id'
      }
    },
    checklist_status: {
      type: DataTypes.JSON,
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'application_workflows',
    timestamps: true,
    underscored: true
  });

  ApplicationWorkflow.associate = function(models) {
    ApplicationWorkflow.belongsTo(models.VisaApplication, {
      foreignKey: 'application_id',
      as: 'application'
    });
    ApplicationWorkflow.belongsTo(models.WorkflowTemplate, {
      foreignKey: 'template_id',
      as: 'template'
    });
  };

  return ApplicationWorkflow;
};
