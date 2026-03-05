/**
 * Text Utilities & Formatter App
 */

const TextUtilsApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="textutils-app">
                <textarea id="textutils-input" placeholder="Type or paste text here..."></textarea>
                <div class="textutils-stats">
                    <span id="char-count">Chars: 0</span> |
                    <span id="word-count">Words: 0</span> |
                    <span id="line-count">Lines: 0</span>
                </div>
                <div class="textutils-actions">
                    <button onclick="TextUtilsApp.transform('upper')">UPPERCASE</button>
                    <button onclick="TextUtilsApp.transform('lower')">lowercase</button>
                    <button onclick="TextUtilsApp.transform('capitalize')">Capitalize</button>
                    <button onclick="TextUtilsApp.transform('trim')">Trim Space</button>
                    <button onclick="TextUtilsApp.transform('clean')">Clean Extra Spaces</button>
                    <button onclick="TextUtilsApp.transform('reverse')">Reverse</button>
                    <button onclick="TextUtilsApp.copy()" class="accent">Copy to Clipboard</button>
                    <button onclick="TextUtilsApp.clear()">Clear</button>
                </div>
            </div>
            <style>
                .textutils-app { padding: 15px; display: flex; flex-direction: column; gap: 10px; height: 100%; }
                #textutils-input { flex-grow: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); resize: none; font-family: monospace; }
                .textutils-stats { font-size: 0.85rem; opacity: 0.7; }
                .textutils-actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
                .textutils-actions button { padding: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
                .textutils-actions button:hover { background: rgba(0,0,0,0.05); }
                .textutils-actions button.accent { background: var(--accent-color); color: white; border: none; }
            </style>
        `;

        this.input = document.getElementById('textutils-input');
        this.charCount = document.getElementById('char-count');
        this.wordCount = document.getElementById('word-count');
        this.lineCount = document.getElementById('line-count');

        this.input.oninput = () => this.updateStats();
    },

    updateStats() {
        const text = this.input.value;
        this.charCount.textContent = `Chars: ${text.length}`;
        this.wordCount.textContent = `Words: ${text.trim() ? text.trim().split(/\s+/).length : 0}`;
        this.lineCount.textContent = `Lines: ${text ? text.split('\n').length : 0}`;
    },

    transform(type) {
        let text = this.input.value;
        switch(type) {
            case 'upper': text = text.toUpperCase(); break;
            case 'lower': text = text.toLowerCase(); break;
            case 'capitalize': text = text.replace(/\b\w/g, l => l.toUpperCase()); break;
            case 'trim': text = text.trim(); break;
            case 'clean': text = text.replace(/\s+/g, ' ').trim(); break;
            case 'reverse': text = text.split('').reverse().join(''); break;
        }
        this.input.value = text;
        this.updateStats();
    },

    copy() {
        this.input.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    },

    clear() {
        this.input.value = '';
        this.updateStats();
    }
};
