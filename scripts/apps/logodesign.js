/**
 * Logo Designer App
 */

const LogoApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="logo-app">
                <div class="logo-sidebar">
                    <label>Text</label>
                    <input type="text" id="logo-text" value="HUB" oninput="LogoApp.update()">
                    <label>Icon</label>
                    <select id="logo-icon" onchange="LogoApp.update()">
                        <option value="fa-rocket">Rocket</option>
                        <option value="fa-bolt">Bolt</option>
                        <option value="fa-heart">Heart</option>
                        <option value="fa-star">Star</option>
                        <option value="fa-code">Code</option>
                    </select>
                    <label>Color</label>
                    <input type="color" id="logo-color" value="#0078d4" oninput="LogoApp.update()">
                    <label>Shape</label>
                    <select id="logo-shape" onchange="LogoApp.update()">
                        <option value="none">None</option>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                    </select>
                </div>
                <div class="logo-preview-area">
                    <div id="logo-preview" class="logo-preview">
                        <div class="logo-shape-el" id="logo-shape-el">
                            <i id="logo-icon-el" class="fas fa-rocket"></i>
                            <span id="logo-text-el">HUB</span>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .logo-app { display: flex; gap: 20px; padding: 15px; height: 100%; }
                .logo-sidebar { width: 200px; display: flex; flex-direction: column; gap: 10px; }
                .logo-sidebar label { font-size: 0.8rem; font-weight: bold; }
                .logo-sidebar input, .logo-sidebar select { padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .logo-preview-area { flex-grow: 1; display: flex; align-items: center; justify-content: center; background: #eee; border-radius: 8px; }
                .logo-preview { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .logo-shape-el { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px; transition: 0.3s; }
                .logo-shape-el.circle { border: 4px solid; border-radius: 50%; min-width: 150px; min-height: 150px; justify-content: center; }
                .logo-shape-el.square { border: 4px solid; min-width: 150px; min-height: 150px; justify-content: center; }
                #logo-icon-el { font-size: 3rem; }
                #logo-text-el { font-size: 1.5rem; font-weight: bold; }
            </style>
        `;
        this.update();
    },

    update() {
        const text = document.getElementById('logo-text').value;
        const icon = document.getElementById('logo-icon').value;
        const color = document.getElementById('logo-color').value;
        const shape = document.getElementById('logo-shape').value;

        const iconEl = document.getElementById('logo-icon-el');
        const textEl = document.getElementById('logo-text-el');
        const shapeEl = document.getElementById('logo-shape-el');

        iconEl.className = 'fas ' + icon;
        iconEl.style.color = color;
        textEl.textContent = text;
        textEl.style.color = color;

        shapeEl.className = 'logo-shape-el ' + shape;
        shapeEl.style.borderColor = color;
    }
};
