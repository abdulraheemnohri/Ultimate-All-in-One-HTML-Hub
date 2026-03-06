const Utils = {
    generateId: () => Math.random().toString(36).substr(2, 9),

    escapeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

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
    },

    // v6 Unified Notification Center
    notifications: [],
    notify: (title, body, icon = 'fa-bell', type = 'info') => {
        const notification = {
            id: Utils.generateId(),
            title,
            body,
            icon,
            type,
            time: new Date(),
            read: false
        };
        Utils.notifications.unshift(notification);
        if (Utils.notifications.length > 50) Utils.notifications.pop();

        Utils.showToast(`${title}: ${body}`, type);
        Utils.updateNotificationBadge();
        return notification.id;
    },

    updateNotificationBadge: () => {
        const badge = document.getElementById('notif-badge');
        const unreadCount = Utils.notifications.filter(n => !n.read).length;
        if (badge) {
            badge.textContent = unreadCount > 0 ? unreadCount : '';
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    },

    // v8 Infinity Security - Encryption Primitives
    async encrypt(data, password) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: enc.encode("hub-infinity-salt"), iterations: 100000, hash: "SHA-256" },
            keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv }, key, enc.encode(data)
        );
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        return btoa(String.fromCharCode.apply(null, combined));
    },

    async decrypt(encryptedData, password) {
        try {
            const enc = new TextEncoder();
            const dec = new TextDecoder();
            const combined = new Uint8Array(atob(encryptedData).split("").map(c => c.charCodeAt(0)));
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            const keyMaterial = await crypto.subtle.importKey(
                "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
            );
            const key = await crypto.subtle.deriveKey(
                { name: "PBKDF2", salt: enc.encode("hub-infinity-salt"), iterations: 100000, hash: "SHA-256" },
                keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
            );
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv }, key, data
            );
            return dec.decode(decrypted);
        } catch (e) {
            throw new Error("Invalid password or corrupted data.");
        }
    }
};
