export default {
  LOGIN: {
    EMAIL_INVALID_MSG: "Invalid email address.",
    PASSWORD_INVALID_MSG: "Password must be at least 8 characters long.",
    PASSWORD_LENGTH_MIN: 8,
  },
  RESET_PASSWORD: {
    TOKEN_INVALID_MSG: "Invalid or expired token.",
    NEW_PASSWORD_INVALID_MSG: "Password must be at least 8 characters long.",
    NEW_PASSWORD_LENGTH_MIN: 8,
  },
} as const;
