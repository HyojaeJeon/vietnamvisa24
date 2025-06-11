module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
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
    document_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    document_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'revision_required'),
      defaultValue: 'pending'
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'documents',
    timestamps: true,
    underscored: true
  });

  Document.associate = function(models) {
    Document.belongsTo(models.VisaApplication, {
      foreignKey: 'application_id',
      as: 'application'
    });

    Document.belongsTo(models.Admin, {
      foreignKey: 'reviewed_by',
      as: 'reviewer'
    });
  };

  return Document;
};