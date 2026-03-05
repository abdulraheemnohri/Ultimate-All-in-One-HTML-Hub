const MemeApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="meme-app">
                <div class="meme-controls">
                    <input type="text" id="meme-top" placeholder="Top Text" oninput="MemeApp.draw()">
                    <input type="text" id="meme-bottom" placeholder="Bottom Text" oninput="MemeApp.draw()">
                    <input type="file" id="meme-file" accept="image/*" onchange="MemeApp.loadImage(event)">
                    <button onclick="MemeApp.download()">Download</button>
                </div>
                <div class="meme-preview">
                    <canvas id="meme-canvas"></canvas>
                </div>
            </div>
            <style>
                .meme-app { display: flex; flex-direction: column; gap: 15px; height: 100%; }
                .meme-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .meme-controls input { padding: 8px; border: 1px solid var(--border-color); background: transparent; color: inherit; border-radius: 4px; }
                .meme-preview { flex-grow: 1; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; background: #eee; overflow: hidden; }
                #meme-canvas { max-width: 100%; max-height: 100%; }
            </style>
        `;
        this.canvas = document.getElementById('meme-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
    },

    loadImage(e) {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.image = new Image();
            this.image.onload = () => {
                this.canvas.width = this.image.width;
                this.canvas.height = this.image.height;
                this.draw();
            };
            this.image.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    },

    draw() {
        if (!this.image) return;
        const top = document.getElementById('meme-top').value.toUpperCase();
        const bottom = document.getElementById('meme-bottom').value.toUpperCase();

        this.ctx.drawImage(this.image, 0, 0);

        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = Math.floor(this.canvas.width / 50);
        this.ctx.textAlign = 'center';
        this.ctx.lineJoin = 'round';

        const fontSize = Math.floor(this.canvas.width / 10);
        this.ctx.font = `${fontSize}px Impact, sans-serif`;

        // Top Text
        this.ctx.textBaseline = 'top';
        this.ctx.strokeText(top, this.canvas.width / 2, 10);
        this.ctx.fillText(top, this.canvas.width / 2, 10);

        // Bottom Text
        this.ctx.textBaseline = 'bottom';
        this.ctx.strokeText(bottom, this.canvas.width / 2, this.canvas.height - 10);
        this.ctx.fillText(bottom, this.canvas.width / 2, this.canvas.height - 10);
    },

    download() {
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
};
