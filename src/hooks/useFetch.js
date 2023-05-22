import authService from "services/authService";
import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";

/**
 * Custom hook for fetching data from an API
 *
 * @param {string} url - The API endpoint to fetch data from
 * @param {string} [method=GET] - The HTTP method to use for the request (GET, POST, PUT, DELETE)
 * @param {object} [body=null] - The data to send in the request body (only for POST and PUT requests)
 * @returns {object} An object containing the fetched data, loading state, and error state, as well as helper functions for making PUT, POST, and DELETE requests
 */

const useFetch = (url, method = "GET", body = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = authService.getUser();
  const accessToken = user ? user.access_token : null;

  useEffect(() => {
    /**
     * Fetches data from the API endpoint using the specified HTTP method and request body
     */
    const fetchData = async () => {
      try {
        const options = { method };
        if (accessToken) {
          options.headers = { Authorization: `Bearer ${accessToken}` };
        }
        if (body) {
          options.headers = {
            ...options.headers,
            "Content-Type": "application/json",
          };
          options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        Sentry.captureException(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, body, accessToken]);

  /**
   * Makes a PUT request to the same API endpoint with the specified request body
   *
   * @param {object} body - The data to send in the request body
   * @returns {object} An object containing the fetched data, loading state, and error state, as well as helper functions for making PUT, POST, and DELETE requests
   */

  const Put = (body) => {
    return useFetch(url, "PUT", body);
  };

  /**
   * Makes a POST request to the same API endpoint with the specified request body
   *
   * @param {object} body - The data to send in the request body
   * @returns {object} An object containing the fetched data, loading state, and error state, as well as helper functions for making PUT, POST, and DELETE requests
   */
  const Post = (body) => {
    return useFetch(url, "POST", body);
  };

  /**
   * Makes a DELETE request to the same API endpoint
   *
   * @returns {object} An object containing the fetched data, loading state, and error state, as well as helper functions for making PUT, POST, and DELETE requests
   */

  const Delete = () => {
    return useFetch(url, "DELETE", null);
  };

  return { data, loading, error, Put, Post, Delete };
};

export default useFetch;
