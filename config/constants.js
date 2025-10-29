export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}

export const GENDER_OPTIONS = ['male', 'female', 'other']

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 10,
  MAX_PHOTOS_PER_PROPERTY: 50,
  MIN_PHOTOS_REQUIRED: 5
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const PRICING_LIMITS = {
  MIN_NIGHTLY_PRICE: 1,
  MAX_NIGHTLY_PRICE: 100000,
  MAX_WEEKLY_DISCOUNT: 100,
  MAX_MONTHLY_DISCOUNT: 100,
  DEFAULT_CURRENCY: 'EUR'
}

export const AVAILABILITY_TYPES = {
  ALWAYS: 'always',
  SOMETIMES: 'sometimes',
  ONE_TIME: 'one_time'
}
