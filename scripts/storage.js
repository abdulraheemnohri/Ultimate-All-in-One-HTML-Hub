const Storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(`hub_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("Storage save error:", e);
            return false;
        }
    },

    load: (key) => {
        try {
            const data = localStorage.getItem(`hub_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Storage load error:", e);
            return null;
        }
    },

    remove: (key) => {
        localStorage.removeItem(`hub_${key}`);
    },

    clearAll: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('hub_')) {
                localStorage.removeItem(key);
            }
        });
    },

    exportData: () => {
        const data = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('hub_')) {
                data[key.replace('hub_', '')] = JSON.parse(localStorage.getItem(key));
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
