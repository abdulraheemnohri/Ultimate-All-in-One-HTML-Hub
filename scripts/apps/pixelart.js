/**
 * Pixel Art Creator App
 */

const PixelArtApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.size = 16;
        this.currentColor = '#0078d4';
        this.isDrawing = false;
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="pixelart-app">
                <div class="pixel-controls">
                    <input type="color" id="pixel-color" value="${this.currentColor}">
                    <button onclick="PixelArtApp.clearGrid()">Clear</button>
                    <select onchange="PixelArtApp.resize(this.value)">
                        <option value="8">8x8</option>
                        <option value="16" selected>16x16</option>
                        <option value="32">32x32</option>
                    </select>
                </div>
                <div id="pixel-grid" class="pixel-grid"></div>
            </div>
            <style>
                .pixelart-app { padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
                .pixel-controls { display: flex; gap: 10px; align-items: center; }
                .pixel-grid {
                    display: grid;
                    background: white;
                    border: 1px solid #ccc;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .pixel {
                    width: 20px; height: 20px; border: 1px solid #eee; cursor: crosshair;
                    background: #fff;
                }
                .pixel:hover { background: #f0f0f0; }
            </style>
        `;

        this.grid = document.getElementById('pixel-grid');
        this.colorInput = document.getElementById('pixel-color');
        this.colorInput.onchange = (e) => this.currentColor = e.target.value;

        this.createGrid();
    },

    createGrid() {
        this.grid.style.gridTemplateColumns = `repeat(${this.size}, 20px)`;
        this.grid.innerHTML = '';
        for (let i = 0; i < this.size * this.size; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.onmousedown = () => {
                this.isDrawing = true;
                pixel.style.backgroundColor = this.currentColor;
            };
            pixel.onmouseenter = () => {
                if (this.isDrawing) pixel.style.backgroundColor = this.currentColor;
            };
            this.grid.appendChild(pixel);
        }
        window.addEventListener('mouseup', () => this.isDrawing = false);
    },

    clearGrid() {
        this.grid.querySelectorAll('.pixel').forEach(p => p.style.backgroundColor = '#fff');
    },

    resize(newSize) {
        this.size = parseInt(newSize);
        this.createGrid();
    }
};
