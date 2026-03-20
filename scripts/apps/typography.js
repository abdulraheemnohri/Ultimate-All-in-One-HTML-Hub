/**
 * Typography Playground App
 */

const TypographyApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="typography-app">
                <div class="typo-controls">
                    <div class="control-group">
                        <label>Font Family</label>
                        <select id="typo-font">
                            <option value="sans-serif">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="monospace">Monospace</option>
                            <option value="'Playfair Display', serif">Playfair Display</option>
                            <option value="'Roboto', sans-serif">Roboto</option>
                            <option value="'Courier New', Courier, monospace">Courier New</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Size: <span id="size-val">32px</span></label>
                        <input type="range" id="typo-size" min="12" max="120" value="32">
                    </div>
                    <div class="control-group">
                        <label>Weight</label>
                        <select id="typo-weight">
                            <option value="300">Light</option>
                            <option value="400" selected>Regular</option>
                            <option value="700">Bold</option>
                            <option value="900">Black</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Line Height</label>
                        <input type="range" id="typo-lineheight" min="0.8" max="2.5" step="0.1" value="1.2">
                    </div>
                </div>

                <div class="typo-preview-container">
                    <div id="typo-preview" contenteditable="true">
                        The quick brown fox jumps over the lazy dog.
                        Click here to edit this text and experiment with typography.
                    </div>
                </div>
            </div>
            <style>
                .typography-app { display: flex; flex-direction: column; height: 100%; }
                .typo-controls { padding: 15px; background: rgba(0,0,0,0.05); display: flex; flex-wrap: wrap; gap: 15px; border-bottom: 1px solid var(--border-color); }
                .control-group { display: flex; flex-direction: column; gap: 5px; }
                .control-group label { font-size: 0.8rem; font-weight: bold; }
                .typo-preview-container { flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; align-items: center; justify-content: center; }
                #typo-preview { width: 100%; outline: none; border: 1px dashed transparent; transition: border 0.3s; padding: 10px; text-align: center; }
                #typo-preview:focus { border-color: var(--accent-color); }
            </style>
        `;

        const preview = document.getElementById('typo-preview');
        const font = document.getElementById('typo-font');
        const size = document.getElementById('typo-size');
        const weight = document.getElementById('typo-weight');
        const lineHeight = document.getElementById('typo-lineheight');
        const sizeVal = document.getElementById('size-val');

        const update = () => {
            preview.style.fontFamily = font.value;
            preview.style.fontSize = size.value + 'px';
            preview.style.fontWeight = weight.value;
            preview.style.lineHeight = lineHeight.value;
            sizeVal.textContent = size.value + 'px';
        };

        font.onchange = update;
        size.oninput = update;
        weight.onchange = update;
        lineHeight.oninput = update;

        update();
    }
};
