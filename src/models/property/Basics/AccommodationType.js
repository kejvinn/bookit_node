import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/sequelize.js';

class AccommodationType extends Model {
  static associate(models) {
    AccommodationType.hasMany(models.Property, {
      foreignKey: 'accommodation_type_id',
      as: 'properties'
    });
  }
}

AccommodationType.init({
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
}, {
  sequelize,
  modelName: 'AccommodationType',
  tableName: 'accommodation_types',
  timestamps: false
});

export default AccommodationType;