import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/sequelize.js';

class Characteristic extends Model {
  static associate(models) {
    Characteristic.belongsToMany(models.Property, {
      through: 'characteristics_properties',
      foreignKey: 'characteristic_id',
      otherKey: 'property_id',
      as: 'properties'
    });

    Characteristic.hasMany(models.CharacteristicTranslation, {
      foreignKey: 'characteristic_id',
      as: 'translations'
    });
  }
}

Characteristic.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  icon_class: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Characteristic',
  tableName: 'characteristics',
  timestamps: false
});

export default Characteristic;