import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../../config/sequelize.js'

class Country extends Model {
  static associate(models) {
    Country.hasMany(models.State, {
      foreignKey: 'country_id',
      as: 'states'
    })

    Country.hasMany(models.Property, {
      foreignKey: 'country_id',
      as: 'properties'
    })
  }
}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    zone_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    currency_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    iso_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      comment: 'e.g., USA, ITA, DEU'
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    phonecode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    numcode: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    contains_states: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    need_identification_number: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    need_zip_code: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    },
    zip_code_format: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ''
    },
    display_tax_label: {
      type: DataTypes.TINYINT(1),
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
    modelName: 'Country',
    tableName: 'countries',
    timestamps: false,
    indexes: [
      { name: 'countries_zone_id_foreign', fields: ['zone_id'] },
      { name: 'countries_iso_code', fields: ['iso_code'] },
      { name: 'countries_currency_id_foreign', fields: ['currency_id'] }
    ]
  }
)

export default Country
