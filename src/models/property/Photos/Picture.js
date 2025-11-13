import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class PropertyPicture extends Model {
  static associate(models) {
    PropertyPicture.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })

    PropertyPicture.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    })
  }
}

PropertyPicture.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    file_hash: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    image_caption: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_featured: {
      type: DataTypes.TINYINT(1),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    modelName: 'PropertyPicture',
    tableName: 'property_pictures',
    indexes: [
      { name: 'property_id', fields: ['property_id'] },
      { name: 'user_id', fields: ['user_id'] },
      { name: 'idx_property_pictures_property_hash', fields: ['property_id', 'file_hash'] }
    ]
  }
)

export default PropertyPicture
