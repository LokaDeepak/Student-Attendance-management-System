/**
 * dashboard.js - Dashboard Logic
 * Student Attendance Management System
 */

(function() {
    'use strict';

    // Sidebar navigation highlight
    function highlightCurrentPage() {
        const path = window.location.pathname;
        const links = document.querySelectorAll('.nav-item');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            }
        });
    }

    // Initialize Charts (using simple CSS/SVG or Placeholder for now)
    // In a real app, we would use Chart.js or ApexCharts here
    function initCharts() {
        // Example: Animate progress bars on load
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }

    // Initialize Dashboard
    function init() {
        highlightCurrentPage();
        initCharts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
