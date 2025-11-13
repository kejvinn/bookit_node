import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class PropertyStep extends Model {
  static associate(models) {
    PropertyStep.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })
  }

  getCompletedSteps() {
    const steps = ['basics', 'description', 'location', 'photos', 'pricing', 'calendar']
    return steps.filter((step) => this[step] === 1)
  }

  getProgress() {
    const completed = this.getCompletedSteps().length
    return Math.round((completed / 6) * 100)
  }

  isComplete() {
    return this.getCompletedSteps().length === 6
  }

  async completeStep(stepName) {
    if (this[stepName] !== undefined) {
      this[stepName] = 1
      await this.save()
    }
  }
}

PropertyStep.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    basics: {
      type: DataTypes.TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    location: {
      type: DataTypes.TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    photos: {
      type: DataTypes.TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    pricing: {
      type: DataTypes.TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    calendar: {
      type: DataTypes.TINYINT(1).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'PropertyStep',
    tableName: 'property_steps',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'property_id',
        fields: ['property_id']
      }
    ]
  }
)

export default PropertyStep
