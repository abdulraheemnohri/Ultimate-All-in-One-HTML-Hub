/**
 * Code Editor App - Simple syntax-highlighting text editor for VFS
 */

const CodeEditorApp = {
    init(containerId, params = {}) {
        this.container = document.getElementById(containerId);
        this.currentFile = params.file || null;
        this.render();
        if (this.currentFile) this.loadFile(this.currentFile);
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="code-editor-app">
                <div class="editor-toolbar">
                    <span id="file-label">${this.currentFile || 'New File'}</span>
                    <button onclick="CodeEditorApp.saveFile()"><i class="fas fa-save"></i> Save</button>
                </div>
                <textarea id="code-textarea" spellcheck="false" placeholder="Enter code or text..."></textarea>
            </div>
            <style>
                .code-editor-app { display: flex; flex-direction: column; height: 100%; }
                .editor-toolbar { background: rgba(0,0,0,0.1); padding: 5px 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; }
                #code-textarea { flex-grow: 1; border: none; background: #282c34; color: #abb2bf; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; padding: 15px; resize: none; font-size: 1rem; line-height: 1.5; }
                #code-textarea:focus { outline: none; }
                .editor-toolbar button { background: var(--accent-color); color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; }
            </style>
        `;
    },

    async loadFile(path) {
        const file = await VFS.getFile(path);
        if (file) {
            this.currentFile = path;
            this.container.querySelector('#file-label').textContent = path;
            this.container.querySelector('#code-textarea').value = file.content;
        }
    },

    async saveFile() {
        const content = this.container.querySelector('#code-textarea').value;
        if (!this.currentFile) {
            const name = prompt('Enter filename (with extension):', 'script.js');
            if (!name) return;
            this.currentFile = '/'+name;
        }
        await VFS.writeFile(this.currentFile, content, 'text/plain');
        this.container.querySelector('#file-label').textContent = this.currentFile;
        Utils.showToast('File saved to VFS', 'success');
    }
};
