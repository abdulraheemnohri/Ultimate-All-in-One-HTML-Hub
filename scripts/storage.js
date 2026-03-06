const Storage = {
    currentUser: 'default',

    setUser(username) {
        this.currentUser = username;
        localStorage.setItem('hub_current_user', username);
    },

    getUser() {
        return localStorage.getItem('hub_current_user') || 'default';
    },

    save: (key, data) => {
        try {
            const user = Storage.getUser();
            localStorage.setItem(`hub_${user}_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("Storage save error:", e);
            return false;
        }
    },

    load: (key) => {
        try {
            const user = Storage.getUser();
            const data = localStorage.getItem(`hub_${user}_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Storage load error:", e);
            return null;
        }
    },

    remove: (key) => {
        const user = Storage.getUser();
        localStorage.removeItem(`hub_${user}_${key}`);
    },

    clearAll: () => {
        const user = Storage.getUser();
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`hub_${user}_`)) {
                localStorage.removeItem(key);
            }
        });
    },

    exportData: () => {
        const data = {};
        const user = Storage.getUser();
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`hub_${user}_`)) {
                data[key.replace(`hub_${user}_`, '')] = JSON.parse(localStorage.getItem(key));
            }
        });
        return JSON.stringify(data, null, 2);
    },

    importData: (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            Object.keys(data).forEach(key => {
                Storage.save(key, data[key]);
            });
            return true;
        } catch (e) {
            console.error("Import error:", e);
            return false;
        }
    }
};
