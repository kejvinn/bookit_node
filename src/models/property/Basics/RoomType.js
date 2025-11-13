import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class RoomType extends Model {
  static associate(models) {
    RoomType.hasMany(models.Property, {
      foreignKey: 'room_type_id',
      as: 'properties'
    })
  }
}

RoomType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    room_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true
    },
    language_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    room_type_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'RoomType',
    tableName: 'room_types',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['room_type_id']
      },
      {
        name: 'language_id',
        fields: ['language_id', 'room_type_name']
      }
    ]
  }
)

export default RoomType
