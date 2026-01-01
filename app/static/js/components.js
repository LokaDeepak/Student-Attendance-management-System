/**
 * components.js - Reusable UI Components
 * Student Attendance Management System
 * 
 * JavaScript components for modals, toasts, dropdowns, and other UI elements.
 */

(function() {
    'use strict';

    /* ==========================================
       TOAST NOTIFICATIONS
       ========================================== */
    
    const Toast = {
        container: null,

        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        },

        show(message, type = 'info', duration = 5000) {
            this.init();

            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${icons[type]}</span>
                <div class="toast-content">
                    <p class="toast-message">${message}</p>
                </div>
                <button class="toast-close" aria-label="Close">✕</button>
            `;

            // Close button handler
            toast.querySelector('.toast-close').addEventListener('click', () => {
                this.dismiss(toast);
            });

            this.container.appendChild(toast);

            // Auto dismiss
            if (duration > 0) {
                setTimeout(() => this.dismiss(toast), duration);
            }

            return toast;
        },

        dismiss(toast) {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        },

        success(message, duration) { return this.show(message, 'success', duration); },
        error(message, duration) { return this.show(message, 'error', duration); },
        warning(message, duration) { return this.show(message, 'warning', duration); },
        info(message, duration) { return this.show(message, 'info', duration); }
    };

    /* ==========================================
       MODAL COMPONENT
       ========================================== */

    const Modal = {
        open(modalId) {
            const modal = document.getElementById(modalId);
            const backdrop = document.querySelector('.modal-backdrop');
            
            if (modal) {
                backdrop?.classList.add('active');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },

        close(modalId) {
            const modal = document.getElementById(modalId);
            const backdrop = document.querySelector('.modal-backdrop');
            
            if (modal) {
                modal.classList.remove('active');
                backdrop?.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        closeAll() {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.querySelector('.modal-backdrop')?.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Setup modal event listeners
    document.addEventListener('click', (e) => {
        // Open modal
        if (e.target.closest('[data-modal-open]')) {
            const modalId = e.target.closest('[data-modal-open]').dataset.modalOpen;
            Modal.open(modalId);
        }
        
        // Close modal
        if (e.target.closest('[data-modal-close]')) {
            const modal = e.target.closest('.modal');
            if (modal) Modal.close(modal.id);
        }
        
        // Close on backdrop click
        if (e.target.classList.contains('modal-backdrop')) {
            Modal.closeAll();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Modal.closeAll();
        }
    });

    /* ==========================================
       DROPDOWN COMPONENT
       ========================================== */

    const Dropdown = {
        toggle(dropdownElement) {
            const isActive = dropdownElement.classList.contains('active');
            this.closeAll();
            if (!isActive) {
                dropdownElement.classList.add('active');
            }
        },

        closeAll() {
            document.querySelectorAll('.dropdown.active').forEach(d => {
                d.classList.remove('active');
            });
        }
    };

    // Setup dropdown event listeners
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-dropdown-toggle]');
        if (trigger) {
            const dropdown = trigger.closest('.dropdown');
            if (dropdown) {
                e.stopPropagation();
                Dropdown.toggle(dropdown);
            }
        } else {
            Dropdown.closeAll();
        }
    });

    /* ==========================================
       TABS COMPONENT
       ========================================== */

    const Tabs = {
        switch(tabsContainer, tabId) {
            // Update tab buttons
            tabsContainer.querySelectorAll('.tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabId);
            });

            // Update tab content
            const contentContainer = document.querySelector(tabsContainer.dataset.tabContent);
            if (contentContainer) {
                contentContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.toggle('active', content.id === tabId);
                });
            }
        }
    };

    // Setup tab event listeners
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab[data-tab]');
        if (tab) {
            const tabsContainer = tab.closest('.tabs');
            if (tabsContainer) {
                Tabs.switch(tabsContainer, tab.dataset.tab);
            }
        }
    });

    /* ==========================================
       SIDEBAR TOGGLE (MOBILE)
       ========================================== */

    const Sidebar = {
        toggle() {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            
            if (sidebar) {
                sidebar.classList.toggle('open');
                overlay?.classList.toggle('active');
            }
        },

        close() {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            
            sidebar?.classList.remove('open');
            overlay?.classList.remove('active');
        }
    };

    // Setup sidebar event listeners
    document.addEventListener('click', (e) => {
        if (e.target.closest('.sidebar-toggle')) {
            Sidebar.toggle();
        }
        if (e.target.classList.contains('sidebar-overlay')) {
            Sidebar.close();
        }
    });

    /* ==========================================
       SCROLL REVEAL
       ========================================== */

    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => observer.observe(el));
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }

    /* ==========================================
       FORM VALIDATION HELPERS
       ========================================== */

    const FormValidator = {
        validate(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('[required]');
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            
            return isValid;
        },

        validateField(input) {
            const value = input.value.trim();
            let isValid = true;
            let errorMsg = '';

            // Required check
            if (input.hasAttribute('required') && !value) {
                isValid = false;
                errorMsg = 'This field is required';
            }

            // Email check
            if (input.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMsg = 'Please enter a valid email';
                }
            }

            // Min length check
            if (input.minLength > 0 && value.length < input.minLength) {
                isValid = false;
                errorMsg = `Minimum ${input.minLength} characters required`;
            }

            // Show/hide error
            this.showError(input, isValid ? '' : errorMsg);
            
            return isValid;
        },

        showError(input, message) {
            const group = input.closest('.form-group');
            let errorEl = group?.querySelector('.form-error');

            if (message) {
                input.classList.add('error');
                if (group && !errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.className = 'form-error';
                    group.appendChild(errorEl);
                }
                if (errorEl) errorEl.textContent = message;
            } else {
                input.classList.remove('error');
                errorEl?.remove();
            }
        }
    };

    // Expose to global scope
    window.Toast = Toast;
    window.Modal = Modal;
    window.Dropdown = Dropdown;
    window.Tabs = Tabs;
    window.Sidebar = Sidebar;
    window.FormValidator = FormValidator;
})();
