import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/sequelize.js';

class CharacteristicTranslation extends Model {
  static associate(models) {
    CharacteristicTranslation.belongsTo(models.Characteristic, {
      foreignKey: 'characteristic_id',
      as: 'characteristic'
    });
  }
}

CharacteristicTranslation.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  characteristic_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'characteristics',
      key: 'id'
    }
  },
  language_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  characteristic_name: {
    type: DataTypes.STRING(160),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CharacteristicTranslation',
  tableName: 'characteristic_translations',
  timestamps: false
});

export default CharacteristicTranslation;