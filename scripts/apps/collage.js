/**
 * Collage Maker App
 */

const CollageApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.images = [];
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="collage-app">
                <div class="collage-controls">
                    <input type="file" id="collage-upload" accept="image/*" multiple onchange="CollageApp.handleUpload(event)">
                    <button onclick="CollageApp.clear()">Clear All</button>
                    <p><small>Drag images to move them.</small></p>
                </div>
                <div id="collage-canvas" class="collage-canvas"></div>
            </div>
            <style>
                .collage-app { display: flex; flex-direction: column; gap: 15px; padding: 15px; height: 100%; }
                .collage-controls { display: flex; gap: 10px; align-items: center; }
                .collage-canvas {
                    flex-grow: 1; background: white; border: 1px dashed var(--border-color);
                    position: relative; overflow: hidden; border-radius: 8px;
                }
                .collage-img {
                    position: absolute; cursor: move; border: 2px solid transparent;
                    max-width: 200px; transition: border 0.2s;
                    user-select: none;
                }
                .collage-img:hover { border-color: var(--accent-color); }
            </style>
        `;
        this.canvas = document.getElementById('collage-canvas');
    },

    handleUpload(event) {
        const files = event.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'collage-img';
                img.style.left = '50px';
                img.style.top = '50px';
                this.canvas.appendChild(img);
                this.setupDrag(img);
            };
            reader.readAsDataURL(file);
        }
    },

    setupDrag(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        el.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmousemove = elementDrag;
            document.onmouseup = closeDragElement;
            el.style.zIndex = ++Hub.zIndexCounter;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    },

    clear() {
        this.canvas.innerHTML = '';
    }
};
