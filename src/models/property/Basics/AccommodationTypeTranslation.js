import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class AccommodationTypeTranslation extends Model {
  static associate(models) {
    AccommodationTypeTranslation.belongsTo(models.AccommodationType, {
      foreignKey: 'accommodation_type_id',
      as: 'accommodation_type'
    })
  }
}

AccommodationTypeTranslation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    accommodation_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    language_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    accommodation_type_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'AccommodationTypeTranslation',
    tableName: 'accommodation_type_translations',
    timestamps: false,
    indexes: [
      {
        name: 'language_id',
        fields: ['language_id', 'accommodation_type_name']
      }
    ]
  }
)

export default AccommodationTypeTranslation
