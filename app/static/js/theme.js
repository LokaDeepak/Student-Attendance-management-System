/**
 * theme.js - Theme Management
 * Student Attendance Management System
 * 
 * Handles dark/light mode toggle with system preference detection
 * and localStorage persistence.
 */

(function() {
    'use strict';

    // Theme constants
    const THEME_KEY = 'sams-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    /**
     * Get the user's preferred theme from localStorage or system preference
     */
    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) {
            return stored;
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    }

    /**
     * Apply theme to the document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        
        // Update any theme toggle buttons
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(toggle => {
            const darkIcon = toggle.querySelector('.icon-dark');
            const lightIcon = toggle.querySelector('.icon-light');
            if (darkIcon && lightIcon) {
                darkIcon.style.display = theme === DARK ? 'none' : 'block';
                lightIcon.style.display = theme === DARK ? 'block' : 'none';
            }
        });
    }

    /**
     * Toggle between dark and light themes
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || DARK;
        const newTheme = current === DARK ? LIGHT : DARK;
        applyTheme(newTheme);
    }

    /**
     * Initialize theme on page load
     */
    function init() {
        // Apply theme immediately to prevent flash
        applyTheme(getPreferredTheme());

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? DARK : LIGHT);
            }
        });

        // Setup theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-theme-toggle]')) {
                toggleTheme();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose to global scope
    window.Theme = {
        toggle: toggleTheme,
        set: applyTheme,
        get: () => document.documentElement.getAttribute('data-theme')
    };
})();
