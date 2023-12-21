import authService from "services/authService";
import { useState, useCallback } from "react";
import * as Sentry from "@sentry/react";

/**
 * Custom hook for fetching data from an API
 *
 * @param {string} url - The API endpoint to fetch data from
 * @param {boolean} [isPublic=false] - Whether or not the API endpoint is public (no authentication required)
 * @param {boolean} [noResponse=false] - Whether or not to return the response from the API endpoint
 * @returns {object} An object containing the fetched data, loading state, and error state, as well as helper functions for making PUT, POST, and DELETE requests
 */

const useFetch = (url, isPublic = false, noResponse = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches data from the API endpoint using the specified HTTP method and request body
     */

    const fetchData = useCallback(
        async ({ method = "GET", body, returnHttpResponse = false, id, param }) => {
            try {
                const options = { method };
                if (!isPublic) {
                    const user = await authService.getUser();
                    if (user) {
                        options.headers = { Authorization: `Bearer ${user?.access_token}` };
                    }
                }

                let fullUrl = id ? `${url}/${id}` : url;
                if (param) {
                    fullUrl = `${url}${param}`;
                }

                if (body) {
                    options.headers = {
                        ...options.headers,
                        "Content-Type": "application/json",
                    };
                    options.body = JSON.stringify(body);
                }
                const response = await fetch(fullUrl, options);

                if (returnHttpResponse) {
                    return response;
                }


                try {
                    const jsonData = await response.clone().json();
                    setData(jsonData);
                    return jsonData;
                } catch {
                    const textData = await response.text();
                    setData(textData);
                    return textData;
                }


                // let json = null;
                // if (!noResponse) {
                //     json = await response.json();
                // }
            } catch (error) {
                Sentry.captureException(error);
                setError(error);
                setLoading(false);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [url, isPublic, noResponse]
    );

    const Get = useCallback(
        (body, returnHttpResponse, id, param) => {
            return fetchData({ method: "GET", body, returnHttpResponse, id, param });
        },
        [fetchData]
    );

    const Post = useCallback(
        (body, returnHttpResponse, id) => {
            return fetchData({ method: "POST", body, returnHttpResponse, id });
        },
        [fetchData]
    );

    const Put = useCallback(
        (body, returnHttpResponse, id) => {
            return fetchData({ method: "PUT", body, returnHttpResponse, id });
        },
        [fetchData]
    );

    const Delete = useCallback(
        (body, returnHttpResponse, id) => {
            return fetchData({ method: "DELETE", body, returnHttpResponse, id });
        },
        [fetchData]
    );

    return { data, loading, error, Put, Post, Delete, Get };
};

export default useFetch;
