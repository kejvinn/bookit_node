import sequelize from '../../config/sequelize.js'
import User from './auth/User.js'
import UserProfile from './auth/UserProfile.js'
import Property from './property/Property.js'
import PropertyStep from './property/PropertyStep.js'
import RoomType from './property/Basics/RoomType.js'
import AccommodationType from './property/Basics/AccommodationType.js'
import AccommodationTypeTranslation from './property/Basics/AccommodationTypeTranslation.js'
import Characteristic from './property/Description/Characteristic.js'
import CharacteristicTranslation from './property/Description/CharacteristicTranslation.js'
import CharacteristicsProperties from './property/Description/CharacteristicsProperties.js'
import PropertyTranslation from './property/Description/PropertyTranslation.js'
import Country from './property/Location/Country.js'
import State from './property/Location/State.js'
import PropertyPicture from './property/Photos/Picture.js'
import PropertyPrice from './property/Price/Price.js'
import PropertySeasonalPrice from './property/Price/SeasonalPrice.js'
import Calendar from './property/Calendar/Calendar.js'
import Reservation from './reservation/Reservation.js'
import Coupon from './coupon/Coupon.js'
import Wishlist from './wishlist/Wishlist.js'
import UserWishlist from './wishlist/UserWishlist.js'

const models = {
  User,
  UserProfile,
  Property,
  PropertyStep,
  RoomType,
  AccommodationType,
  AccommodationTypeTranslation,
  Characteristic,
  CharacteristicTranslation,
  CharacteristicsProperties,
  PropertyTranslation,
  Country,
  State,
  PropertyPicture,
  PropertyPrice,
  PropertySeasonalPrice,
  Calendar,
  Reservation,
  Coupon,
  Wishlist,
  UserWishlist
}

// Setup associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize

export default models
export {
  User,
  UserProfile,
  Property,
  PropertyStep,
  RoomType,
  AccommodationType,
  AccommodationTypeTranslation,
  Characteristic,
  CharacteristicTranslation,
  CharacteristicsProperties,
  PropertyTranslation,
  Country,
  State,
  PropertyPicture,
  PropertyPrice,
  PropertySeasonalPrice,
  Calendar,
  Reservation,
  Coupon,
  Wishlist,
  UserWishlist
}
