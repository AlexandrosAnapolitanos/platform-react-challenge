// 1. Machine-readable codes (application-level identifiers)

export const ErrorCodes = {
  FAILED_TO_FETCH_FAVORITES: "FAILED_TO_FETCH_FAVORITES",
  // Add more as needed
} as const;

// 2. Human-readable error messages (for display)

export const ErrorMessages = {
  [ErrorCodes.FAILED_TO_FETCH_FAVORITES]: "Failed to fetch Favorites",
  // Add more as needed
} as const;

// 3. HTTP status codes for each error code
export const HttpStatusCodes = {
  [ErrorCodes.FAILED_TO_FETCH_FAVORITES]: 409,
  // Add more as needed
} as const;
