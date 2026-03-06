/**
 * Photo Editor App
 */

const PhotoEditApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="photoedit-app">
                <div class="photo-controls">
                    <input type="file" id="photo-upload" accept="image/*" onchange="PhotoEditApp.handleUpload(event)">
                    <div class="filters">
                        <label>Brightness</label>
                        <input type="range" id="bright" min="0" max="200" value="100" oninput="PhotoEditApp.applyFilters()">
                        <label>Contrast</label>
                        <input type="range" id="contrast" min="0" max="200" value="100" oninput="PhotoEditApp.applyFilters()">
                        <label>Saturate</label>
                        <input type="range" id="saturate" min="0" max="200" value="100" oninput="PhotoEditApp.applyFilters()">
                        <label>Grayscale</label>
                        <input type="range" id="grayscale" min="0" max="100" value="0" oninput="PhotoEditApp.applyFilters()">
                        <label>Sepia</label>
                        <input type="range" id="sepia" min="0" max="100" value="0" oninput="PhotoEditApp.applyFilters()">
                    </div>
                </div>
                <div class="photo-preview-container">
                    <img id="photo-preview" src="" style="display:none">
                    <div id="no-photo">Upload an image to start editing</div>
                </div>
            </div>
            <style>
                .photoedit-app { display: flex; gap: 20px; padding: 15px; height: 100%; }
                .photo-controls { width: 220px; display: flex; flex-direction: column; gap: 15px; }
                .filters { display: flex; flex-direction: column; gap: 8px; }
                .filters label { font-size: 0.8rem; opacity: 0.8; }
                .photo-preview-container { flex-grow: 1; display: flex; align-items: center; justify-content: center; background: #eee; border-radius: 8px; overflow: hidden; }
                #photo-preview { max-width: 100%; max-height: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                #no-photo { opacity: 0.5; }
            </style>
        `;
    },

    handleUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.getElementById('photo-preview');
                img.src = e.target.result;
                img.style.display = 'block';
                document.getElementById('no-photo').style.display = 'none';
                this.applyFilters();
            };
            reader.readAsDataURL(file);
        }
    },

    applyFilters() {
        const b = document.getElementById('bright').value;
        const c = document.getElementById('contrast').value;
        const s = document.getElementById('saturate').value;
        const g = document.getElementById('grayscale').value;
        const sp = document.getElementById('sepia').value;

        const img = document.getElementById('photo-preview');
        img.style.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) grayscale(${g}%) sepia(${sp}%)`;
    }
};
