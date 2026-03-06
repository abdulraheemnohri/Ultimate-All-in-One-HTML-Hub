/**
 * Hub VFS - Virtual File System based on IndexedDB
 */

const VFS = {
    db: null,
    dbName: 'HubVFS',
    storeName: 'files',

    async init() {
        const user = Storage.getUser();
        this.storeName = `files_${user}`;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 2); // Bump version for dynamic stores
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                // In a real multi-user app, we'd need to handle this more dynamically,
                // but for v5 we'll ensure stores exist on the fly or during init.
                const user = Storage.getUser();
                const storeName = `files_${user}`;
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, { keyPath: 'path' });
                    store.createIndex('parent', 'parent', { unique: false });
                }
                // Also ensure 'default' exists
                if (!db.objectStoreNames.contains('files_default')) {
                    const store = db.createObjectStore('files_default', { keyPath: 'path' });
                    store.createIndex('parent', 'parent', { unique: false });
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                this.ensureRoot().then(resolve);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    },

    async ensureRoot() {
        const root = await this.getFile('/');
        if (!root) {
            await this.writeFile('/', '', 'directory');
        }
    },

    async getFile(path) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(path);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    },

    async writeFile(path, content, type = 'text/plain', metadata = {}) {
        const parent = path === '/' ? null : path.substring(0, path.lastIndexOf('/')) || '/';
        const name = path === '/' ? '/' : path.substring(path.lastIndexOf('/') + 1);

        const file = {
            path,
            name,
            parent,
            content,
            type,
            size: typeof content === 'string' ? content.length : (content.byteLength || 0),
            modified: Date.now(),
            ...metadata
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(file);
            request.onsuccess = () => resolve(file);
            request.onerror = () => reject(request.error);
        });
    },

    async listFiles(parentPath) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('parent');
            const request = index.getAll(parentPath);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve([]);
        });
    },

    async deleteFile(path) {
        // If directory, delete children too (recursively)
        const file = await this.getFile(path);
        if (file && file.type === 'directory') {
            const children = await this.listFiles(path);
            for (const child of children) {
                await this.deleteFile(child.path);
            }
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(path);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // File Associations
    getAssociation(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const map = {
            'txt': 'notes',
            'md': 'markdown',
            'html': 'mini-browser',
            'jpg': 'photo-edit',
            'png': 'photo-edit',
            'mp3': 'audio-player',
            'mp4': 'video-player',
            'json': 'text-utils'
        };
        return map[ext] || 'text-utils';
    }
};
