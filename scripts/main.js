/**
 * Ultimate All-in-One HTML Hub - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    Hub.init();
});

const Hub = {
    apps: {},
    windows: [],
    activeWindow: null,
    zIndexCounter: 100,
    appCleanups: {},

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.setupEventListeners();
        this.registerServiceWorker();
        console.log("Hub Initialized");
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(() => console.log('Service Worker Registered'))
                .catch(err => console.log('SW Registration Failed', err));
        }
    },

    setupEventListeners() {
        // Sidebar Navigation
        document.querySelectorAll('#sidebar-nav li').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.getAttribute('data-app');
                this.openApp(appId);
            });
        });

        // Theme Toggle
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn.addEventListener('click', () => this.toggleTheme());

        // Mobile Sidebar Toggle
        const startBtn = document.getElementById('start-menu-btn');
        startBtn.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('show');
        });

        // Settings Button
        const settingsBtn = document.getElementById('settings-btn');
        settingsBtn.addEventListener('click', () => this.openApp('settings'));

        // Load saved theme
        const savedTheme = Storage.load('theme');
        if (savedTheme === 'dark') {
            document.body.classList.replace('light-theme', 'dark-theme');
            document.querySelector('#theme-toggle i').classList.replace('fa-moon', 'fa-sun');
        }
    },

    updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.textContent = now.toLocaleTimeString();
        }
    },

    toggleTheme() {
        const body = document.body;
        const icon = document.querySelector('#theme-toggle i');
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            icon.classList.replace('fa-moon', 'fa-sun');
            Storage.save('theme', 'dark');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
            Storage.save('theme', 'light');
        }
    },

    openApp(appId) {
        // Check if app already open
        const existingWindow = this.windows.find(w => w.appId === appId);
        if (existingWindow) {
            this.focusWindow(existingWindow.el);
            return;
        }

        this.createWindow(appId);
    },

    createWindow(appId) {
        const appName = this.getAppName(appId);
        const windowId = `window-${Utils.generateId()}`;

        const winEl = document.createElement('div');
        winEl.className = 'window';
        winEl.id = windowId;
        winEl.style.top = `${50 + (this.windows.length * 20)}px`;
        winEl.style.left = `${50 + (this.windows.length * 20)}px`;
        winEl.style.zIndex = ++this.zIndexCounter;

        winEl.innerHTML = `
            <div class="window-header">
                <span class="window-title">${appName}</span>
                <div class="window-controls">
                    <span class="control-minimize" onclick="Hub.minimizeWindow('${windowId}')"></span>
                    <span class="control-maximize" onclick="Hub.maximizeWindow('${windowId}')"></span>
                    <span class="control-close" onclick="Hub.closeWindow('${windowId}')"></span>
                </div>
            </div>
            <div class="window-content" id="content-${windowId}">
                <div class="loader">Loading ${appName}...</div>
            </div>
            <div class="window-resize-handle"></div>
        `;

        document.getElementById('workspace').appendChild(winEl);

        const winObj = { id: windowId, appId, el: winEl };
        this.windows.push(winObj);
        this.focusWindow(winEl);
        this.addToTaskbar(winObj);

        // Load app-specific logic
        const cleanup = this.loadAppContent(appId, `content-${windowId}`);
        if (typeof cleanup === 'function') {
            this.appCleanups[windowId] = cleanup;
        }

        // Setup Drag & Resize (to be implemented in next step)
        this.setupWindowInteractions(winEl);
    },

    getAppName(appId) {
        const item = document.querySelector(`#sidebar-nav li[data-app="${appId}"]`);
        return item ? item.textContent.trim() : appId;
    },

    focusWindow(winEl) {
        if (this.activeWindow) {
            this.activeWindow.classList.remove('active');
        }
        this.activeWindow = winEl;
        this.activeWindow.classList.add('active');
        this.activeWindow.style.zIndex = ++this.zIndexCounter;
    },

    closeWindow(windowId) {
        const index = this.windows.findIndex(w => w.id === windowId);
        if (index !== -1) {
            const win = this.windows[index];

            // Cleanup app logic
            if (this.appCleanups[windowId]) {
                try {
                    this.appCleanups[windowId]();
                } catch (e) {
                    console.error("Cleanup failed", e);
                }
                delete this.appCleanups[windowId];
            }

            win.el.remove();
            this.removeFromTaskbar(windowId);
            this.windows.splice(index, 1);
        }
    },

    minimizeWindow(windowId) {
        const win = this.windows.find(w => w.id === windowId);
        if (win) {
            win.el.style.display = 'none';
        }
    },

    maximizeWindow(windowId) {
        const win = this.windows.find(w => w.id === windowId);
        if (win) {
            if (win.el.classList.contains('maximized')) {
                win.el.classList.remove('maximized');
                win.el.style.top = win.oldTop;
                win.el.style.left = win.oldLeft;
                win.el.style.width = win.oldWidth;
                win.el.style.height = win.oldHeight;
            } else {
                win.oldTop = win.el.style.top;
                win.oldLeft = win.el.style.left;
                win.oldWidth = win.el.style.width;
                win.oldHeight = win.el.style.height;

                win.el.classList.add('maximized');
                win.el.style.top = '0';
                win.el.style.left = '0';
                win.el.style.width = '100%';
                win.el.style.height = '100%';
            }
        }
    },

    addToTaskbar(winObj) {
        const taskbar = document.getElementById('running-apps');
        const item = document.createElement('div');
        item.className = 'taskbar-item';
        item.id = `taskbar-${winObj.id}`;
        item.textContent = this.getAppName(winObj.appId);
        item.onclick = () => {
            if (winObj.el.style.display === 'none') {
                winObj.el.style.display = 'flex';
                this.focusWindow(winObj.el);
            } else if (this.activeWindow === winObj.el) {
                this.minimizeWindow(winObj.id);
            } else {
                this.focusWindow(winObj.el);
            }
        };
        taskbar.appendChild(item);
    },

    removeFromTaskbar(windowId) {
        const item = document.getElementById(`taskbar-${windowId}`);
        if (item) item.remove();
    },

    loadAppContent(appId, containerId) {
        const container = document.getElementById(containerId);

        switch(appId) {
            case 'todo':
                return TodoApp.init(containerId);
            case 'notes':
                return NotesApp.init(containerId);
            case 'calendar':
                return CalendarApp.init(containerId);
            case 'finance':
                return FinanceApp.init(containerId);
            case 'sketchpad':
                return SketchpadApp.init(containerId);
            case 'meme-gen':
                return MemeApp.init(containerId);
            case 'quiz':
                return QuizApp.init(containerId);
            case 'flashcards':
                return FlashcardsApp.init(containerId);
            case 'calculator':
                return CalculatorApp.init(containerId);
            case 'audio-player':
                return AudioPlayerApp.init(containerId);
            case 'video-player':
                return VideoPlayerApp.init(containerId);
            case 'mini-browser':
                return MiniBrowserApp.init(containerId);
            case 'games':
                return GamesApp.init(containerId);
            case 'settings':
                this.loadSettingsApp(containerId);
                break;
            default:
                container.innerHTML = `<p>${appId.charAt(0).toUpperCase() + appId.slice(1)} app content goes here.</p>`;
        }
    },

    loadSettingsApp(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="settings-app">
                <section>
                    <h3>Data Management</h3>
                    <p>Backup or restore all your hub data.</p>
                    <div class="button-group">
                        <button onclick="Hub.exportAllData()">Export JSON</button>
                        <button onclick="Hub.triggerImport()">Import JSON</button>
                        <input type="file" id="import-file" style="display:none" onchange="Hub.importAllData(event)">
                    </div>
                </section>
                <section style="margin-top: 20px;">
                    <h3>Storage Usage</h3>
                    <p id="storage-usage">Calculating...</p>
                    <button class="danger" onclick="Hub.clearAllData()">Clear All Data</button>
                </section>
                <section style="margin-top: 20px;">
                    <h3>About</h3>
                    <p>Ultimate All-in-One HTML Hub v1.0</p>
                </section>
            </div>
            <style>
                .settings-app h3 { margin-bottom: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px; }
                .settings-app .button-group { display: flex; gap: 10px; margin-top: 10px; }
                .settings-app button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .settings-app button.danger { background: #ff5f56; margin-top: 10px; }
            </style>
        `;

        // Calculate storage usage
        const usage = (JSON.stringify(localStorage).length / 1024).toFixed(2);
        document.getElementById('storage-usage').textContent = `Total data stored: ${usage} KB`;
    },

    exportAllData() {
        const data = Storage.exportData();
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hub-backup.json';
        a.click();
    },

    triggerImport() {
        document.getElementById('import-file').click();
    },

    importAllData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (Storage.importData(e.target.result)) {
                    alert('Data imported successfully! Reloading...');
                    location.reload();
                } else {
                    alert('Invalid backup file.');
                }
            };
            reader.readAsText(file);
        }
    },

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
            Storage.clearAll();
            location.reload();
        }
    },

    setupWindowInteractions(winEl) {
        winEl.addEventListener('mousedown', () => this.focusWindow(winEl));

        const header = winEl.querySelector('.window-header');
        const resizeHandle = winEl.querySelector('.window-resize-handle');

        // Dragging
        header.onmousedown = (e) => {
            if (winEl.classList.contains('maximized')) return;

            e.preventDefault();
            let pos1 = 0, pos2 = 0, pos3 = e.clientX, pos4 = e.clientY;

            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                winEl.style.top = (winEl.offsetTop - pos2) + "px";
                winEl.style.left = (winEl.offsetLeft - pos1) + "px";
                winEl.style.transition = 'none';
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                winEl.style.transition = '';
            };
        };

        // Resizing
        resizeHandle.onmousedown = (e) => {
            e.preventDefault();
            let startWidth = winEl.offsetWidth;
            let startHeight = winEl.offsetHeight;
            let startX = e.clientX;
            let startY = e.clientY;

            document.onmousemove = (e) => {
                e.preventDefault();
                const width = startWidth + (e.clientX - startX);
                const height = startHeight + (e.clientY - startY);
                winEl.style.width = width + "px";
                winEl.style.height = height + "px";
                winEl.style.transition = 'none';
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                winEl.style.transition = '';
            };
        };
    }
};
