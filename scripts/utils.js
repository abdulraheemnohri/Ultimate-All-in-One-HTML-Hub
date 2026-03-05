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
    }
};
