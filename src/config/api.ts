export const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api/v1",
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
      VERIFY_EMAIL: "/auth/verify-email"
    },
    USERS: "/users",
    VOCABULARIES: "/vocabularies",
    CATEGORIES: "/categories"
  }
};

export default API_CONFIG;
