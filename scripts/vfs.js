/**
 * Hub VFS - Virtual File System based on IndexedDB
 */

const VFS = {
    db: null,
    dbName: 'HubVFS',
    storeName: 'files',

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 3); // Unified multi-user store
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'path' });
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

    getInternalPath(path) {
        const user = Storage.getUser() || 'default';
        return `${user}:${path}`;
    },

    async ensureRoot() {
        const root = await this.getFile('/');
        if (!root) {
            await this.writeFile('/', '', 'directory');
        }
    },

    async getFile(path) {
        const internalPath = this.getInternalPath(path);
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(internalPath);
            request.onsuccess = () => {
                if (request.result) {
                    // Strip prefix for public consumption
                    const file = { ...request.result };
                    file.path = path;
                    file.parent = path === '/' ? null : path.substring(0, path.lastIndexOf('/')) || '/';
                    return resolve(file);
                }
                resolve(null);
            };
            request.onerror = () => resolve(null);
        });
    },

    async readFile(path) {
        const file = await this.getFile(path);
        return file ? file.content : null;
    },

    async writeFile(path, content, type = 'text/plain', metadata = {}) {
        const internalPath = this.getInternalPath(path);
        const parent = path === '/' ? null : path.substring(0, path.lastIndexOf('/')) || '/';
        const internalParent = parent ? this.getInternalPath(parent) : null;
        const name = path === '/' ? '/' : path.substring(path.lastIndexOf('/') + 1);

        const file = {
            path: internalPath,
            name,
            parent: internalParent,
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
            request.onsuccess = () => {
                const publicFile = { ...file, path, parent };
                resolve(publicFile);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async listFiles(parentPath) {
        const internalParent = this.getInternalPath(parentPath);
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('parent');
            const request = index.getAll(internalParent);
            request.onsuccess = () => {
                const user = Storage.getUser() || 'default';
                const prefix = `${user}:`;
                const files = request.result.map(f => ({
                    ...f,
                    path: f.path.startsWith(prefix) ? f.path.substring(prefix.length) : f.path,
                    parent: f.parent && f.parent.startsWith(prefix) ? f.parent.substring(prefix.length) : f.parent
                }));
                resolve(files);
            };
            request.onerror = () => resolve([]);
        });
    },

    async deleteFile(path) {
        const internalPath = this.getInternalPath(path);
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
            const request = store.delete(internalPath);
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
