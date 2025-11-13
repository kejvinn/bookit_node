import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class Calendar extends Model {
  static associate(models) {
    Calendar.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })
  }
}

Calendar.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
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
    calendar_data: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'JSON: blocked_dates, custom_pricing, etc.',
      get() {
        const rawValue = this.getDataValue('calendar_data')
        if (!rawValue) return { blocked_dates: [], custom_pricing: [] }
        try {
          return JSON.parse(rawValue)
        } catch {
          return { blocked_dates: [], custom_pricing: [] }
        }
      },
      set(value) {
        this.setDataValue('calendar_data', JSON.stringify(value))
      }
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'calendars',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
    comment: 'This table holds the calendar for each property',
    indexes: [
      {
        unique: true,
        fields: ['property_id']
      }
    ]
  }
)

export default Calendar
