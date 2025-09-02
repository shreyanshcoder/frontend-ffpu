/**
 * Query Execution Hook Module
 * Provides functionality for executing trading queries and saving strategies
 * with proper error handling and loading states
 */

import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/config"; // Adjust path as needed

// Create a shared state outside the hook
let sharedResponseData = null;
let sharedLoading = false;
let sharedError = null;

/**
 * Custom hook for executing trading queries and managing strategy operations
 *
 * @returns {Object} Query execution functions and state management
 */
const useExecuteQuery = () => {
  const [loading, setLoading] = useState(sharedLoading);
  const [error, setError] = useState(sharedError);
  const [responseData, setResponseData] = useState(sharedResponseData);

  /**
   * Executes a trading query with the provided parameters
   *
   * @param {Object} queryResults - The query parameters and data
   * @param {string} sessionId - Current session identifier
   * @param {string} userToken - User authentication token
   * @returns {Promise<Object>} Query execution results
   */
  const executeQuery = async (queryResults, sessionId, userToken) => {
    setLoading(true);
    sharedLoading = true;
    setError(null);
    sharedError = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.EXECUTE_QUERY, {
        session_id: sessionId,
        user_token: userToken,
        data: queryResults,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("useExecute 1 ", response.data);
      setResponseData(response.data);
      sharedResponseData = response.data;
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      setError(errorMessage);
      sharedError = errorMessage;
      console.error("Error executing query:", errorMessage);
    } finally {
      setLoading(false);
      sharedLoading = false;
    }
  };

  /**
   * Saves a trading strategy with the provided parameters
   *
   * @param {string} sessionId - Current session identifier
   * @param {string} stratNameAlias - Name/alias for the strategy
   * @param {boolean} isPublic - Whether the strategy should be public
   * @returns {Promise<Object>} Strategy save operation results
   */
  const saveStrategy = async (sessionId, stratNameAlias, isPublic) => {
    setLoading(true);
    sharedLoading = true;
    setError(null);
    sharedError = null;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.SAVE_STRATEGY, {
        session_id: sessionId,
        strat_name_alias: stratNameAlias,
        isPublic: isPublic ? 1 : 0,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setResponseData(response.data);
      sharedResponseData = response.data;
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      setError(errorMessage);
      sharedError = errorMessage;
      console.error("Error saving strategy:", errorMessage);
    } finally {
      setLoading(false);
      sharedLoading = false;
    }
  };

  return { executeQuery, saveStrategy, loading, error, responseData };
};

export default useExecuteQuery;
