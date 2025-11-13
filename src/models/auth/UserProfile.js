import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class UserProfile extends Model {
  static associate(models) {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    })
  }
}

UserProfile.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    job_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    about: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zip: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    linkedin: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    twitter: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    facebook: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    googleplus: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    pinterest: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    instagram: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    vimeo: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    youtube: {
      type: DataTypes.STRING(512),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    hobbies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    knowledge: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    references: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    credit_card_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    credit_card_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    credit_card_expire: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    credit_card_security_code: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    card_holder: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    banner: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    deleted: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    indexes: [{ name: 'user_id', fields: ['user_id'] }],
    uniqueKeys: {
      user_id_unique: { fields: ['user_id'] }
    }
  }
)

export default UserProfile
