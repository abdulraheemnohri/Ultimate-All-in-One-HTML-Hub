/**
 * Local File Manager App
 */

const FileManagerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="fileman-app">
                <div class="file-toolbar">
                    <button onclick="FileManagerApp.uploadFile()"><i class="fas fa-upload"></i> Upload to Storage</button>
                    <p><small>Virtual file view (stored in browser)</small></p>
                </div>
                <div id="file-list" class="file-list">
                    <div class="empty-msg">No files uploaded to virtual drive.</div>
                </div>
            </div>
            <style>
                .fileman-app { padding: 15px; }
                .file-toolbar { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
                .file-toolbar button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .file-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; }
                .file-item { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
                .file-item i { font-size: 2.5rem; color: #ffbd2e; }
                .file-item span { font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; width: 100%; white-space: nowrap; }
                .empty-msg { grid-column: 1 / -1; text-align: center; opacity: 0.5; padding: 40px; }
            </style>
        `;
    },

    uploadFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const list = document.getElementById('file-list');
                const empty = list.querySelector('.empty-msg');
                if (empty) empty.remove();

                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                `;
                list.appendChild(item);
            }
        };
        input.click();
    }
};
