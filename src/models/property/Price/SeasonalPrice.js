import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class PropertySeasonalPrice extends Model {
  static associate(models) {
    PropertySeasonalPrice.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })
  }

  isActive(date = new Date()) {
    const checkDate = new Date(date)
    const start = new Date(this.start_date)
    const end = new Date(this.end_date)
    return checkDate >= start && checkDate <= end
  }
}

PropertySeasonalPrice.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Special price for this date range'
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(11),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'SeasonalPrice',
    tableName: 'seasonal_prices',
    indexes: [
      {
        unique: true,
        fields: ['property_id']
      }
    ]
  }
)

export default PropertySeasonalPrice
