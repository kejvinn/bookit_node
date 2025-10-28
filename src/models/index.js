import sequelize from '../../config/sequelize.js';
import User from './auth/User.js';
import UserProfile from './auth/UserProfile.js';
import Property from './property/Property.js';
import PropertyStep from './property/PropertyStep.js';
import RoomType from './property/Basics/RoomType.js';

const models = {
  User,
  UserProfile,
  Property,
  PropertyStep,
  RoomType
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
  Property,
  PropertyStep,
  RoomType
};