import PropertyRepository from '../../repositories/property/PropertyRepository.js';
import PropertyTranslationRepository from '../../repositories/property/PropertyTranslationRepository.js';
import CharacteristicRepository from '../../repositories/property/CharacteristicRepository.js';
import { AppError } from '../../utils/helpers.js';

class DescriptionService {
  async updateAmenities(propertyId, userId, characteristicIds) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    });

    if (!property) {
      throw new AppError('Property not found or unauthorized', 404);
    }

    // Validate IDs
    if (
      Array.isArray(characteristicIds) &&
      characteristicIds.length > 0
    ) {
      const isValid =
        await CharacteristicRepository.validateCharacteristicIds(
          characteristicIds
        );
      if (!isValid) {
        throw new AppError('Invalid characteristic IDs provided', 400);
      }
    }

    await CharacteristicRepository.updatePropertyCharacteristics(
      propertyId,
      characteristicIds
    );

    await this.tryCompleteDescriptionStep(propertyId);

    return await PropertyRepository.findByIdWithDetails(propertyId);
  }

  async updateDescription(propertyId, userId, data, languageId = 1) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    });

    if (!property) {
      throw new AppError('Property not found or unauthorized', 404);
    }

    const allowedFields = [
      'title',
      'description',
      'space',
      'access',
      'interaction',
      'notes',
      'house_rules',
      'neighborhood_overview',
      'location_description'
    ];

    const translationData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) translationData[field] = data[field];
    }

    await PropertyTranslationRepository.upsertTranslation(
      propertyId,
      languageId,
      translationData
    );

    await this.tryCompleteDescriptionStep(propertyId);

    return await PropertyRepository.findByIdWithDetails(propertyId, languageId);
  }

  async getCharacteristics(languageId = 1) {
    return await CharacteristicRepository.getAllWithTranslations(languageId);
  }

  async getPropertyAmenities(propertyId) {
    return await CharacteristicRepository.getPropertyCharacteristics(propertyId);
  }

  async getPropertyTranslations(propertyId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    });

    if (!property) {
      throw new AppError('Property not found or unauthorized', 404);
    }

    return await PropertyTranslationRepository.findAllByProperty(propertyId);
  }

  async tryCompleteDescriptionStep(propertyId) {
    const [translation, amenities] = await Promise.all([
      PropertyTranslationRepository.findByPropertyAndLanguage(
        propertyId,
        1
      ),
      CharacteristicRepository.getPropertyCharacteristics(propertyId)
    ]);

    const hasWrittenDescription =
      translation && translation.title && translation.description;

    const hasAmenities =
      Array.isArray(amenities) && amenities.length > 0;

    if (hasWrittenDescription && hasAmenities) {
      await PropertyRepository.markStepStatus(propertyId, 'description', true);
    } else {
      await PropertyRepository.markStepStatus(propertyId, 'description', false);
    }
  }
}

export default new DescriptionService();