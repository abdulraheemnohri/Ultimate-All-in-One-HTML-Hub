const SketchpadApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.canvas = document.getElementById('sketch-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.painting = false;
        this.color = '#000000';
        this.lineWidth = 5;
        this.setupCanvas();
        return () => {
            if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
        };
    },

    render() {
        this.container.innerHTML = `
            <div class="sketch-app">
                <div class="sketch-toolbar">
                    <input type="color" id="sketch-color" value="#000000">
                    <input type="range" id="sketch-width" min="1" max="20" value="5">
                    <button onclick="SketchpadApp.clearCanvas()">Clear</button>
                    <button onclick="SketchpadApp.saveDrawing()">Save</button>
                </div>
                <div class="canvas-container">
                    <canvas id="sketch-canvas"></canvas>
                </div>
            </div>
            <style>
                .sketch-app { display: flex; flex-direction: column; height: 100%; }
                .sketch-toolbar { display: flex; gap: 10px; margin-bottom: 10px; padding: 5px; background: rgba(0,0,0,0.05); border-radius: 4px; }
                .canvas-container { flex-grow: 1; border: 1px solid var(--border-color); background: white; }
                #sketch-canvas { width: 100%; height: 100%; cursor: crosshair; }
            </style>
        `;
    },

    setupCanvas() {
        this.resizeHandler = () => {
            if (!this.canvas.parentElement) return;
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        };
        window.addEventListener('resize', this.resizeHandler);
        this.resizeHandler();

        this.canvas.onmousedown = (e) => { this.painting = true; this.draw(e); };
        this.canvas.onmousemove = (e) => this.draw(e);
        this.canvas.onmouseup = () => { this.painting = false; this.ctx.beginPath(); };

        document.getElementById('sketch-color').onchange = (e) => this.color = e.target.value;
        document.getElementById('sketch-width').onchange = (e) => this.lineWidth = e.target.value;
    },

    draw(e) {
        if (!this.painting) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.color;

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    },

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    saveDrawing() {
        const dataUrl = this.canvas.toDataURL();
        const drawings = Storage.load('drawings') || [];
        drawings.push({ id: Utils.generateId(), data: dataUrl, date: new Date().toISOString() });
        Storage.save('drawings', drawings);
        alert('Drawing saved!');
    }
};
