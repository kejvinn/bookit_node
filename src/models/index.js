import sequelize from '../../config/sequelize.js';
import User from './auth/User.js';
import UserProfile from './auth/UserProfile.js';

const models = {
  User,
  UserProfile,
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
export { 
  User, 
  UserProfile,
};