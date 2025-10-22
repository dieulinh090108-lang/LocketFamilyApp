// API constants
export const API_CONFIG = {
  BASE_URL: 'https://api.locketfamily.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // User endpoints
  USER_PROFILE: '/user/profile',
  USER_UPDATE: '/user/update',

  // Family endpoints
  FAMILY_MEMBERS: '/family/members',
  FAMILY_ADD_MEMBER: '/family/add-member',
  FAMILY_REMOVE_MEMBER: '/family/remove-member',

  // Media endpoints
  UPLOAD_IMAGE: '/media/upload',
  UPLOAD_VIDEO: '/media/upload-video',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
