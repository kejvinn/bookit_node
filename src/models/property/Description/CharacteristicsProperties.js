import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class CharacteristicsProperties extends Model {}

CharacteristicsProperties.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    characteristic_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'characteristics',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'CharacteristicsProperties',
    tableName: 'characteristics_properties',
    timestamps: false
  }
)

export default CharacteristicsProperties
