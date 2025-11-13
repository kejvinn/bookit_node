import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class PropertyTranslation extends Model {
  static associate(models) {
    PropertyTranslation.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })
  }
}

PropertyTranslation.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
      // NO references
    },
    language_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    space: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the space/rooms'
    },
    access: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Guest access information'
    },
    interaction: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Host interaction level'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes for guests'
    },
    house_rules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    neighborhood_overview: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seo_title: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    seo_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    seo_keywords: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'PropertyTranslation',
    tableName: 'property_translations',
    indexes: [
      { name: 'property_id', fields: ['property_id'] },
      { name: 'language_id', fields: ['language_id'] },
      { name: 'title', fields: ['title'] },
      { name: 'idx_property_translation_lang', fields: ['property_id', 'language_id'] }
    ]
  }
)

export default PropertyTranslation
