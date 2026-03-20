/**
 * Color Palette Generator App
 */

const PaletteApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.generate();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="palette-app">
                <div id="palette-colors"></div>
                <div class="palette-controls">
                    <button id="gen-palette-btn">Generate New Palette</button>
                    <p>Click a color to copy hex code</p>
                </div>
            </div>
            <style>
                .palette-app { padding: 20px; height: 100%; display: flex; flex-direction: column; }
                #palette-colors { flex-grow: 1; display: flex; border-radius: 12px; overflow: hidden; min-height: 200px; }
                .color-swatch { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 20px; cursor: pointer; transition: 0.2s; }
                .color-swatch:hover { flex: 1.2; }
                .color-swatch span { background: rgba(0,0,0,0.5); color: white; padding: 5px 10px; border-radius: 4px; font-family: monospace; }
                .palette-controls { text-align: center; margin-top: 20px; }
                .palette-controls button { padding: 10px 20px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
                .palette-controls p { margin-top: 10px; opacity: 0.6; font-size: 0.9rem; }
            </style>
        `;

        this.paletteEl = document.getElementById('palette-colors');
        document.getElementById('gen-palette-btn').onclick = () => this.generate();
    },

    generate() {
        this.paletteEl.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const color = this.randomHex();
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.innerHTML = `<span>${color}</span>`;
            swatch.onclick = () => {
                navigator.clipboard.writeText(color);
                const span = swatch.querySelector('span');
                const oldText = span.textContent;
                span.textContent = 'COPIED!';
                setTimeout(() => span.textContent = oldText, 1000);
            };
            this.paletteEl.appendChild(swatch);
        }
    },

    randomHex() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
};
