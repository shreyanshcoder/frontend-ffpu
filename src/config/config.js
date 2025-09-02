/**
 * Configuration file for API endpoints and base URL settings
 * This file centralizes all API endpoint configurations for the application
 */

/**
 * Base URL for the API server
 * @constant {string}
 */
const BASE_URL = "http://localhost:8000/api";

/**
 * Collection of all API endpoints used throughout the application
 * @constant {Object}
 */
export const API_ENDPOINTS = {
  // Authentication Endpoints
  /** Endpoint for user login */
  LOGIN: `${BASE_URL}/auth/login`,
  /** Endpoint for user registration */
  SIGNUP: `${BASE_URL}/auth/signup`,
  /** Endpoint for Google OAuth login */
  GOOGLE_LOGIN: `${BASE_URL}/auth/google/login`,
  /** Endpoint for Google OAuth callback */
  GOOGLE_CALLBACK: `${BASE_URL}/auth/google-callback`,
  /** Endpoint for initiating password reset */
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  /** Endpoint for completing password reset */
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  /** Endpoint for retrieving user profile details */
  GET_USER_DETAILS: `${BASE_URL}/auth/get-user-detail`,
  /** Endpoint for updating user profile information */
  UPDATE_USER_DETAILS: `${BASE_URL}/auth/update-user-details`,

  // Strategy Endpoints
  /** Endpoint for executing trading strategy queries */
  EXECUTE_QUERY: `${BASE_URL}/strategy/execute`,
  /** Endpoint for modifying existing queries */
  EDIT_QUERY: `${BASE_URL}/strategy/edit`,
  /** Endpoint for saving new trading strategies */
  SAVE_STRATEGY: `${BASE_URL}/strategy/save`,
  /** Endpoint for retrieving all available strategies */
  GET_ALL_STRATEGIES: `${BASE_URL}/strategy/get_all_public_strategies`,
  /** Endpoint for retrieving user-specific strategies */
  GET_ALL_STRATEGIES_USER: `${BASE_URL}/strategy/get_all_strategy_user`,
  /** Endpoint for retrieving a specific strategy */
  GET_STRATEGY: `${BASE_URL}/strategy/strategies`,
};
