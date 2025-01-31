import { useAuth0 } from "@auth0/auth0-react";
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
    const { getAccessTokenSilently } = useAuth0();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    /**
     * Fetches data from the API endpoint using the specified HTTP method and request body
     */

    const fetchData = useCallback(
        async ({ method = "GET", body, returnHttpResponse = false, id, param }) => {
            setLoading(true);
            try {
                const options = { method };
                if (!isPublic) {
                    const accessToken = await getAccessTokenSilently();
                    if (accessToken) {
                        options.headers = { Authorization: `Bearer ${accessToken}` };
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

                if (response?.status === 400) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Network response was not ok");
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
            } catch (catchError) {
                Sentry.captureException(catchError);
                setError(catchError);
                setLoading(false);
                throw catchError;
            } finally {
                setLoading(false);
            }
        },
        [isPublic, url, getAccessTokenSilently]
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