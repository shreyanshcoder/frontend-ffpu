/**
 * Strategy Management Hook Module
 * Provides functionality for managing trading strategies including fetching,
 * retrieving, and managing strategy data
 */

import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/config";

/**
 * Custom hook for managing trading strategies
 *
 * @param {string} userId - The ID of the current user
 * @returns {Object} Strategy management functions and state
 */
const useStrategy = (userId) => {
  const [strategies, setStrategies] = useState([]);
  const [allStrategies, setAllStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStrategy, setCurrentStrategy] = useState(null);

  // Separate pagination states for saved and public strategies
  const [savedPagination, setSavedPagination] = useState({
    total: 0,
    page: 1,
    page_size: 10,
    total_pages: 0,
  });

  const [publicPagination, setPublicPagination] = useState({
    total: 0,
    page: 1,
    page_size: 10,
    total_pages: 0,
  });

  const fetchStrategies = async (page = 1, pageSize = 6) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_ENDPOINTS.GET_ALL_STRATEGIES_USER}`,
        {
          params: {
            user_id: userId,
            page: page,
            page_size: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStrategies(response.data.strategies);
      setSavedPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch strategies");
      console.error("Error fetching strategies:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStrategies = async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_ENDPOINTS.GET_ALL_STRATEGIES}`, {
        params: {
          page: page,
          page_size: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllStrategies(response.data.strategies);
      setPublicPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch strategies");
      console.error("Error fetching strategies:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStrategy = async (strategyId) => {
    if (!strategyId) return null;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_ENDPOINTS.GET_STRATEGY}`, {
        params: { strategy_id: strategyId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentStrategy(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.message
        : "Failed to fetch strategy";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    strategies,
    allStrategies,
    loading,
    error,
    savedPagination,
    publicPagination,
    fetchStrategies,
    fetchAllStrategies,
    currentStrategy,
    getStrategy, // Make sure to include getStrategy in the return object
  };
};

export default useStrategy;
