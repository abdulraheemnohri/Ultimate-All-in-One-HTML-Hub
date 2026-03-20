/**
 * Markdown Editor App
 */

const MarkdownApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="markdown-app">
                <textarea id="md-input" placeholder="Type Markdown here..."></textarea>
                <div id="md-preview" class="md-preview"></div>
            </div>
            <style>
                .markdown-app { display: flex; height: 100%; border-radius: 8px; overflow: hidden; }
                #md-input { flex: 1; padding: 15px; border: none; border-right: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); resize: none; font-family: monospace; outline: none; }
                .md-preview { flex: 1; padding: 15px; background: white; color: black; overflow-y: auto; }
                .md-preview h1, .md-preview h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 15px; }
                .md-preview code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
            </style>
        `;

        const input = document.getElementById('md-input');
        const preview = document.getElementById('md-preview');

        input.oninput = () => {
            preview.innerHTML = this.parse(input.value);
        };

        // Initial example
        input.value = "# Hello Markdown\n\nThis is a **simple** markdown previewer.\n\n- List item\n- Another item\n\n`code snippet` here.";
        preview.innerHTML = this.parse(input.value);
    },

    parse(md) {
        // Very basic parsing for demo
        return md
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/`(.*)`/gim, '<code>$1</code>')
            .replace(/\n/gim, '<br>');
    }
};
