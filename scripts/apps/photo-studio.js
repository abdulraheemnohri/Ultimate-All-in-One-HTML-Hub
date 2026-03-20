/**
 * Photo Studio App v5 - Canvas Filters & Editing
 */

const PhotoStudioApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="photo-studio">
                <div class="studio-sidebar">
                    <h3>Filters</h3>
                    <button onclick="PhotoStudioApp.applyFilter('none')">Normal</button>
                    <button onclick="PhotoStudioApp.applyFilter('grayscale(100%)')">Grayscale</button>
                    <button onclick="PhotoStudioApp.applyFilter('sepia(100%)')">Sepia</button>
                    <button onclick="PhotoStudioApp.applyFilter('invert(100%)')">Invert</button>
                    <button onclick="PhotoStudioApp.applyFilter('blur(5px)')">Blur</button>
                    <button onclick="PhotoStudioApp.applyFilter('brightness(150%)')">Bright</button>
                    <button onclick="PhotoStudioApp.applyFilter('contrast(200%)')">Contrast</button>
                    <button onclick="PhotoStudioApp.applyFilter('hue-rotate(90deg)')">Hue Shift</button>
                    <hr>
                    <button onclick="PhotoStudioApp.saveImage()" class="save-btn"><i class="fas fa-save"></i> Save to VFS</button>
                </div>
                <div class="studio-main">
                    <div class="drop-zone" id="ps-dropzone">
                        <p>Drag an image here or click to upload</p>
                        <input type="file" id="ps-input" style="display:none" onchange="PhotoStudioApp.loadImage(event)">
                    </div>
                    <canvas id="ps-canvas"></canvas>
                </div>
            </div>
            <style>
                .photo-studio { display: flex; height: 100%; }
                .studio-sidebar { width: 150px; background: rgba(0,0,0,0.1); padding: 10px; display: flex; flex-direction: column; gap: 8px; border-right: 1px solid var(--border-color); }
                .studio-sidebar button { padding: 8px; border: none; background: var(--bg-color); color: var(--text-color); border-radius: 4px; cursor: pointer; text-align: left; }
                .studio-sidebar button:hover { background: var(--accent-color); color: white; }
                .studio-sidebar .save-btn { background: #27c93f; color: white; margin-top: auto; }
                .studio-main { flex-grow: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
                .drop-zone { border: 2px dashed var(--border-color); padding: 40px; border-radius: 10px; cursor: pointer; text-align: center; }
                #ps-canvas { max-width: 90%; max-height: 90%; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
            </style>
        `;

        const dropzone = this.container.querySelector('#ps-dropzone');
        dropzone.onclick = () => this.container.querySelector('#ps-input').click();
    },

    loadImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.image = new Image();
                this.image.onload = () => {
                    this.draw();
                    this.container.querySelector('#ps-dropzone').style.display = 'none';
                    this.container.querySelector('#ps-canvas').style.display = 'block';
                };
                this.image.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    },

    draw() {
        const canvas = this.container.querySelector('#ps-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        ctx.filter = this.currentFilter || 'none';
        ctx.drawImage(this.image, 0, 0);
    },

    applyFilter(filter) {
        this.currentFilter = filter;
        if (this.image) this.draw();
    },

    async saveImage() {
        const canvas = this.container.querySelector('#ps-canvas');
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        const name = `edited_${Date.now()}.png`;
        await VFS.writeFile(`/Pictures/${name}`, dataUrl, 'image/png');
        Utils.showToast(`Saved to /Pictures/${name}`, 'success');
    }
};
