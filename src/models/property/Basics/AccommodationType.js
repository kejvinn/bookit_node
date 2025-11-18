import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class AccommodationType extends Model {
  static associate(models) {
    AccommodationType.hasMany(models.Property, {
      foreignKey: 'accommodation_type_id',
      sourceKey: 'id',
      as: 'properties'
    })
    AccommodationType.hasMany(models.AccommodationTypeTranslation, {
      foreignKey: 'accommodation_type_id',
      sourceKey: 'id',
      as: 'translations'
    })
  }
}

AccommodationType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'AccommodationType',
    tableName: 'accommodation_types',
    timestamps: false
  }
)

export default AccommodationType
