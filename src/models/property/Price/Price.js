import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class PropertyPrice extends Model {
  static associate(models) {
    PropertyPrice.belongsTo(models.Property, {
      foreignKey: 'model_id',
      constraints: false,
      as: 'property'
    })
  }
}

PropertyPrice.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    model_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'Property'
    },
    night: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    week: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    month: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    guests: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    addguests: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cleaning: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    security_deposit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    previous_price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    currency: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: 'EUR'
    }
  },
  {
    sequelize,
    modelName: 'PropertyPrice',
    tableName: 'prices',
    timestamps: false // ✅ Add this line
  }
)

export default PropertyPrice
