/**
 * VFS File Manager App
 */

const FileManagerApp = {
    currentPath: '/',

    init(containerId, params = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.currentPath = params.path || '/';
        this.render();
        this.refresh();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="fileman-app">
                <div class="file-toolbar">
                    <div class="path-bar">
                        <button onclick="FileManagerApp.goUp()"><i class="fas fa-arrow-up"></i></button>
                        <input type="text" id="fm-path" value="${this.currentPath}" readonly>
                    </div>
                    <div class="actions">
                        <button onclick="FileManagerApp.triggerUpload()"><i class="fas fa-upload"></i> Upload</button>
                        <button onclick="FileManagerApp.createFolder()"><i class="fas fa-folder-plus"></i> New Folder</button>
                    </div>
                </div>
                <div id="fm-list" class="file-list">
                    <!-- Files will be listed here -->
                </div>
            </div>
            <input type="file" id="fm-upload-input" style="display:none" multiple onchange="FileManagerApp.handleUpload(event)">
            <style>
                .fileman-app { display: flex; flex-direction: column; height: 100%; padding: 10px; }
                .file-toolbar { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
                .path-bar { display: flex; flex-grow: 1; gap: 5px; }
                .path-bar input { flex-grow: 1; padding: 5px 10px; border-radius: 4px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.1); color: inherit; }
                .file-toolbar button { padding: 6px 12px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
                .file-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; overflow-y: auto; padding: 10px; }
                .file-item { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; padding: 10px; border-radius: 8px; cursor: pointer; transition: background 0.2s; position: relative; }
                .file-item:hover { background: rgba(255,255,255,0.1); }
                .file-item i { font-size: 2.5rem; color: #ffbd2e; }
                .file-item.directory i { color: #3498db; }
                .file-item span { font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; width: 100%; white-space: nowrap; }
                .file-item .delete-btn { position: absolute; top: 2px; right: 2px; background: #ff5f56; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; display: none; align-items: center; justify-content: center; }
                .file-item:hover .delete-btn { display: flex; }
                .empty-msg { grid-column: 1 / -1; text-align: center; opacity: 0.5; padding: 40px; }
            </style>
        `;
    },

    async refresh() {
        const list = this.container.querySelector('#fm-list');
        list.innerHTML = '<div class="loader">Loading files...</div>';

        const files = await VFS.listFiles(this.currentPath);
        list.innerHTML = '';

        if (files.length === 0) {
            list.innerHTML = '<div class="empty-msg">No files in this folder.</div>';
            return;
        }

        files.sort((a, b) => {
            if (a.type === 'directory' && b.type !== 'directory') return -1;
            if (a.type !== 'directory' && b.type === 'directory') return 1;
            return a.name.localeCompare(b.name);
        });

        files.forEach(file => {
            const el = document.createElement('div');
            el.className = `file-item ${file.type === 'directory' ? 'directory' : ''}`;
            const icon = file.type === 'directory' ? 'fa-folder' : this.getFileIcon(file.name);
            el.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${file.name}</span>
                <button class="delete-btn" onclick="event.stopPropagation(); FileManagerApp.deleteFile('${file.path}')"><i class="fas fa-times"></i></button>
            `;
            el.onclick = () => this.openItem(file);
            list.appendChild(el);
        });

        this.container.querySelector('#fm-path').value = this.currentPath;
    },

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const map = {
            'txt': 'fa-file-alt',
            'md': 'fa-file-code',
            'html': 'fa-file-code',
            'css': 'fa-file-code',
            'js': 'fa-file-code',
            'jpg': 'fa-file-image',
            'png': 'fa-file-image',
            'gif': 'fa-file-image',
            'mp3': 'fa-file-audio',
            'mp4': 'fa-file-video',
            'pdf': 'fa-file-pdf',
            'zip': 'fa-file-archive'
        };
        return map[ext] || 'fa-file';
    },

    openItem(file) {
        if (file.type === 'directory') {
            this.currentPath = file.path;
            this.refresh();
        } else {
            const appId = VFS.getAssociation(file.name);
            Hub.openApp(appId, { file: file.path });
        }
    },

    goUp() {
        if (this.currentPath === '/') return;
        this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/')) || '/';
        this.refresh();
    },

    triggerUpload() {
        this.container.querySelector('#fm-upload-input').click();
    },

    async handleUpload(event) {
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const path = (this.currentPath === '/' ? '' : this.currentPath) + '/' + file.name;
                await VFS.writeFile(path, e.target.result, file.type);
                this.refresh();
            };
            if (file.type.startsWith('text/') || file.type === 'application/json') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file); // Store small binaries as data URLs in v4
            }
        }
    },

    async createFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            const path = (this.currentPath === '/' ? '' : this.currentPath) + '/' + name;
            await VFS.writeFile(path, '', 'directory');
            this.refresh();
        }
    },

    async deleteFile(path) {
        if (confirm(`Delete ${path}?`)) {
            await VFS.deleteFile(path);
            this.refresh();
        }
    }
};
