const Utils = {
    generateId: () => Math.random().toString(36).substr(2, 9),

    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    },

    createElement: (tag, className, content) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (content) el.innerHTML = content;
        return el;
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showToast: (message, type = 'info', duration = 3000) => {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            danger: 'fa-times-circle'
        }[type] || 'fa-info-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Slide in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};
