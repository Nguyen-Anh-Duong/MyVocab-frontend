export const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api/v1",
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
      VERIFY_EMAIL: "/auth/verify-email",
      GOOGLE: "/auth/google",
      ME: "/auth/me"
    },
    USERS: {
      BASE: "/users",
      ME: "/users/me"
    },
    VOCABULARIES: "/vocabularies",
    CATEGORIES: "/categories",
    NLP: {
      TEXT_TO_VOCABULARY: "/nlp/text-to-vocabulary"
    },
    // Admin endpoints - using same endpoints but with admin permissions
    ADMIN: {
      USERS: "/users", // Admin can see all users
      VOCABULARIES: "/vocabularies", // Admin can see all vocabularies
      CATEGORIES: "/categories", // Admin can see all categories
      STATS: "/admin/stats" // If available, otherwise we'll compute from other endpoints
    }
  }
};

export default API_CONFIG;
