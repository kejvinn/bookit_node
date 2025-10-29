import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class State extends Model {
  static associate(models) {
    State.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    })

    State.hasMany(models.Property, {
      foreignKey: 'state_id',
      as: 'properties'
    })
  }
}

State.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    country_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
      // NO references
    },
    zone_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    iso_code: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    tax_behavior: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'State',
    tableName: 'states',
    timestamps: false
  }
)

export default State
