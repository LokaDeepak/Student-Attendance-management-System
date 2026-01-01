/**
 * api.js - API Wrapper
 * Student Attendance Management System
 * 
 * Centralized API calls with error handling and token management.
 */

(function() {
    'use strict';

    const API_BASE = '';
    const TOKEN_KEY = 'sams-token';

    /**
     * Get authentication token from localStorage
     */
    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Set authentication token
     */
    function setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    /**
     * Remove authentication token
     */
    function clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    /**
     * Make API request with proper headers and error handling
     */
    async function request(endpoint, options = {}) {
        const url = API_BASE + endpoint;
        const token = getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Parse response
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.detail || data.message || 'An error occurred',
                    data
                };
            }

            return data;
        } catch (error) {
            // Handle network errors
            if (!error.status) {
                throw {
                    status: 0,
                    message: 'Network error. Please check your connection.',
                    data: null
                };
            }
            throw error;
        }
    }

    /**
     * GET request helper
     */
    function get(endpoint) {
        return request(endpoint, { method: 'GET' });
    }

    /**
     * POST request helper
     */
    function post(endpoint, body) {
        return request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    /**
     * PUT request helper
     */
    function put(endpoint, body) {
        return request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    /**
     * DELETE request helper
     */
    function del(endpoint) {
        return request(endpoint, { method: 'DELETE' });
    }

    /**
     * POST form data (for traditional form submissions)
     */
    async function postForm(endpoint, formData) {
        const url = API_BASE + endpoint;
        const token = getToken();

        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        return response;
    }

    // Expose to global scope
    window.API = {
        get,
        post,
        put,
        delete: del,
        postForm,
        setToken,
        getToken,
        clearToken
    };
})();
