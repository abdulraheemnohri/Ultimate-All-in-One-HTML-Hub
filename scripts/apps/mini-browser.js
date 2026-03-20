const MiniBrowserApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.history = [];
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="browser-app">
                <div class="browser-toolbar">
                    <button onclick="MiniBrowserApp.back()"><i class="fas fa-arrow-left"></i></button>
                    <button onclick="MiniBrowserApp.forward()"><i class="fas fa-arrow-right"></i></button>
                    <input type="text" id="browser-url" placeholder="https://..." onkeypress="if(event.key==='Enter') MiniBrowserApp.navigate()">
                    <button onclick="MiniBrowserApp.navigate()">Go</button>
                </div>
                <div class="browser-frame">
                    <iframe id="browser-iframe" src="about:blank"></iframe>
                </div>
                <div class="browser-info">
                    <p><i class="fas fa-info-circle"></i> Some websites may block iframe loading due to security policies (X-Frame-Options).</p>
                </div>
            </div>
            <style>
                .browser-app { display: flex; flex-direction: column; height: 100%; gap: 10px; }
                .browser-toolbar { display: flex; gap: 10px; padding: 5px; background: rgba(0,0,0,0.05); border-radius: 4px; }
                .browser-toolbar input { flex-grow: 1; padding: 5px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: transparent; color: inherit; }
                .browser-toolbar button { padding: 5px 10px; background: none; border: none; cursor: pointer; color: inherit; }
                .browser-frame { flex-grow: 1; border: 1px solid var(--border-color); background: white; border-radius: 4px; overflow: hidden; }
                #browser-iframe { width: 100%; height: 100%; border: none; }
                .browser-info { font-size: 0.7rem; opacity: 0.7; }
            </style>
        `;
    },

    navigate() {
        let url = document.getElementById('browser-url').value;
        if (!url.startsWith('http')) url = 'https://' + url;
        document.getElementById('browser-iframe').src = url;
    },

    back() {
        try {
            document.getElementById('browser-iframe').contentWindow.history.back();
        } catch (e) {
            console.warn("Could not navigate back in iframe due to cross-origin restrictions.");
        }
    },

    forward() {
        try {
            document.getElementById('browser-iframe').contentWindow.history.forward();
        } catch (e) {
            console.warn("Could not navigate forward in iframe due to cross-origin restrictions.");
        }
    }
};
