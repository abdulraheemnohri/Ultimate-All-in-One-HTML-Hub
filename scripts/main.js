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
        this.populateDashboard();
        this.applySettings();
        if (window.LockScreen) LockScreen.init();
        console.log("Hub Initialized");
    },

    applySettings() {
        const accent = Storage.load('accent-color');
        if (accent) document.documentElement.style.setProperty('--accent-color', accent);

        const blur = Storage.load('glass-blur');
        if (blur) document.documentElement.style.setProperty('--glass-effect', `blur(${blur}px)`);
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

        // Collapsible Sidebar Categories
        document.querySelectorAll('.nav-group h3').forEach(header => {
            header.addEventListener('click', () => {
                const group = header.parentElement;
                group.classList.toggle('collapsed');
                const icon = header.querySelector('i.collapse-icon');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-right');
                }
            });
            // Add icon to header
            header.innerHTML = `<i class="fas fa-chevron-down collapse-icon"></i> ` + header.innerHTML;
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

        // Sidebar Search
        const searchInput = document.getElementById('app-search');
        searchInput.addEventListener('input', (e) => this.filterApps(e.target.value));

        // Context Menu
        window.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        window.addEventListener('click', () => this.hideContextMenu());

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Load saved theme
        const savedTheme = Storage.load('theme');
        if (savedTheme === 'dark') {
            document.body.classList.replace('light-theme', 'dark-theme');
            document.querySelector('#theme-toggle i').classList.replace('fa-moon', 'fa-sun');
        }

        // Load saved wallpaper
        const savedWallpaper = Storage.load('wallpaper');
        if (savedWallpaper) {
            this.setWallpaper(savedWallpaper);
        }
    },

    setWallpaper(wp) {
        const workspace = document.getElementById('workspace');
        if (wp.startsWith('http') || wp.startsWith('data:')) {
            workspace.style.backgroundImage = `url('${wp}')`;
            workspace.style.backgroundColor = '';
        } else {
            workspace.style.backgroundImage = 'none';
            workspace.style.background = wp;
        }
        Storage.save('wallpaper', wp);
    },

    populateDashboard() {
        const container = document.querySelector('.quick-access');
        if (!container) return;
        container.innerHTML = '';

        let pinnedApps = Storage.load('pinned-apps');
        if (!pinnedApps) {
            pinnedApps = ['todo', 'notes', 'calendar', 'games', 'sketchpad', 'calculator'];
            Storage.save('pinned-apps', pinnedApps);
        }

        pinnedApps.forEach(appId => {
            const app = this.getAppInfo(appId);
            const tile = document.createElement('div');
            tile.className = 'dashboard-tile';
            tile.innerHTML = `
                <i class="fas ${app.icon}" style="color: ${app.color}"></i>
                <span>${this.getAppName(app.id)}</span>
            `;
            tile.onclick = () => this.openApp(app.id);
            container.appendChild(tile);
        });
    },

    updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.textContent = now.toLocaleTimeString();
        }
    },

    filterApps(query) {
        query = query.toLowerCase();
        document.querySelectorAll('#sidebar-nav li').forEach(item => {
            const text = item.textContent.toLowerCase();
            const group = item.closest('.nav-group');
            if (text.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Hide groups if empty
        document.querySelectorAll('.nav-group').forEach(group => {
            const visibleItems = group.querySelectorAll('li[style="display: block;"]').length;
            const allItems = group.querySelectorAll('li').length;
            // If query is empty, show all
            if (!query) {
                group.style.display = 'block';
                group.querySelectorAll('li').forEach(li => li.style.display = 'block');
            } else {
                group.style.display = visibleItems > 0 ? 'block' : 'none';
            }
        });
    },

    handleKeyboard(e) {
        // Alt + S to search
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            document.getElementById('app-search').focus();
        }

        // Alt + Q to close active window
        if (e.altKey && e.key === 'q') {
            if (this.activeWindow) {
                const winId = this.activeWindow.id;
                this.closeWindow(winId);
            }
        }

        // Alt + M to toggle theme
        if (e.altKey && e.key === 't') {
            this.toggleTheme();
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
        const info = this.getAppInfo(appId);
        return info ? info.name : appId;
    },

    getAppInfo(appId) {
        const item = document.querySelector(`#sidebar-nav li[data-app="${appId}"]`);
        if (!item) return null;
        const icon = item.querySelector('i').className;
        const name = item.textContent.trim();
        // Extract color or use default
        return { id: appId, name, icon, color: 'var(--accent-color)' };
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
            case 'pomodoro':
                return PomodoroApp.init(containerId);
            case 'habits':
                return HabitTrackerApp.init(containerId);
            case 'checklist':
                return ChecklistApp.init(containerId);
            case 'reading-list':
                return ReadingListApp.init(containerId);
            case 'planner':
                return PlannerApp.init(containerId);
            case 'recipes':
                return RecipeApp.init(containerId);
            case 'goals':
                return GoalTrackerApp.init(containerId);
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
            case 'palette':
                return PaletteApp.init(containerId);
            case 'typography':
                return TypographyApp.init(containerId);
            case 'pixelart':
                return PixelArtApp.init(containerId);
            case 'logodesign':
                return LogoApp.init(containerId);
            case 'photo-edit':
                return PhotoEditApp.init(containerId);
            case 'collage':
                return CollageApp.init(containerId);
            case 'quiz':
                return QuizApp.init(containerId);
            case 'flashcards':
                return FlashcardsApp.init(containerId);
            case 'typing':
                return TypingApp.init(containerId);
            case 'math':
                return MathApp.init(containerId);
            case 'vocab':
                return VocabApp.init(containerId);
            case 'calculator':
                return CalculatorApp.init(containerId);
            case 'converter':
                return ConverterApp.init(containerId);
            case 'qrcode':
                return QRCodeApp.init(containerId);
            case 'text-utils':
                return TextUtilsApp.init(containerId);
            case 'pass-gen':
                return PassGenApp.init(containerId);
            case 'timezone':
                return TimezoneApp.init(containerId);
            case 'lorem':
                return LoremApp.init(containerId);
            case 'voice-rec':
                return VoiceRecApp.init(containerId);
            case 'soundboard':
                return SoundboardApp.init(containerId);
            case 'audio-player':
                return AudioPlayerApp.init(containerId);
            case 'video-player':
                return VideoPlayerApp.init(containerId);
            case 'mini-browser':
                return MiniBrowserApp.init(containerId);
            case 'markdown':
                return MarkdownApp.init(containerId);
            case 'file-manager':
                return FileManagerApp.init(containerId);
            case 'minesweeper':
                return MinesweeperApp.init(containerId);
            case 'hangman':
                return HangmanApp.init(containerId);
            case 'memory':
                return MemoryApp.init(containerId);
            case 'rps':
                return RPSApp.init(containerId);
            case 'analytics':
                return AnalyticsApp.init(containerId);
            case 'sysmon':
                return SysMonApp.init(containerId);
            case 'weather':
                return WeatherApp.init(containerId);
            case 'news':
                return NewsApp.init(containerId);
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
        const accent = Storage.load('accent-color') || '#0078d4';
        const blur = Storage.load('glass-blur') || '10';
        const lockEnabled = Storage.load('lock-enabled') || false;

        container.innerHTML = `
            <div class="settings-app">
                <section>
                    <h3>Personalization</h3>
                    <p>Wallpaper URL or Color/Gradient</p>
                    <div class="wallpaper-input">
                        <input type="text" id="wp-url" placeholder="Enter Unsplash URL or color (e.g. #333 or linear-gradient(...))">
                        <button onclick="Hub.applyWallpaper()">Apply</button>
                    </div>
                    <div class="preset-wallpapers">
                        <div class="wp-preset" style="background: #2c3e50" onclick="Hub.setWallpaper('#2c3e50')"></div>
                        <div class="wp-preset" style="background: linear-gradient(45deg, #8e44ad, #3498db)" onclick="Hub.setWallpaper('linear-gradient(45deg, #8e44ad, #3498db)')"></div>
                        <div class="wp-preset" style="background: linear-gradient(45deg, #16a085, #f1c40f)" onclick="Hub.setWallpaper('linear-gradient(45deg, #16a085, #f1c40f)')"></div>
                        <div class="wp-preset" style="background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=100&q=60'); background-size: cover;" onclick="Hub.setWallpaper('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1350&q=80')"></div>
                    </div>

                    <div style="margin-top: 15px; display: flex; gap: 20px; align-items: center;">
                        <div>
                            <p>Accent Color</p>
                            <input type="color" id="accent-picker" value="${accent}" onchange="Hub.changeAccent(this.value)">
                        </div>
                        <div>
                            <p>Glass Blur (px)</p>
                            <input type="range" min="0" max="30" value="${blur}" oninput="Hub.changeBlur(this.value)">
                        </div>
                    </div>
                </section>

                <section style="margin-top: 20px;">
                    <h3>Security</h3>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="lock-toggle" ${lockEnabled ? 'checked' : ''} onchange="Hub.toggleLock(this.checked)">
                        <label for="lock-toggle">Enable Lock Screen (PIN: 1234)</label>
                    </div>
                </section>

                <section style="margin-top: 20px;">
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
                    <p>Ultimate All-in-One HTML Hub v1.1</p>
                </section>
            </div>
            <style>
                .settings-app h3 { margin-bottom: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px; }
                .settings-app .button-group, .settings-app .wallpaper-input { display: flex; gap: 10px; margin-top: 10px; }
                .settings-app input { flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .settings-app button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .settings-app button.danger { background: #ff5f56; margin-top: 10px; }
                .preset-wallpapers { display: flex; gap: 10px; margin-top: 10px; }
                .wp-preset { width: 40px; height: 40px; border-radius: 4px; cursor: pointer; border: 1px solid var(--border-color); }
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

    applyWallpaper() {
        const url = document.getElementById('wp-url').value;
        if (url) this.setWallpaper(url);
    },

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
            Storage.clearAll();
            location.reload();
        }
    },

    changeAccent(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        Storage.save('accent-color', color);
    },

    changeBlur(px) {
        document.documentElement.style.setProperty('--glass-effect', `blur(${px}px)`);
        Storage.save('glass-blur', px);
    },

    toggleLock(enabled) {
        Storage.save('lock-enabled', enabled);
        if (enabled && !Storage.load('lock-passcode')) {
            Storage.save('lock-passcode', '1234');
        }
        Utils.showToast(enabled ? 'Lock Screen Enabled' : 'Lock Screen Disabled', 'info');
    },

    handleContextMenu(e) {
        e.preventDefault();

        // Don't show if clicking on an input or textarea
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

        let menu = document.getElementById('context-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'context-menu';
            document.body.appendChild(menu);
        }

        const isDesktop = e.target.id === 'workspace' || e.target.id === 'home-dashboard' || e.target.closest('#home-dashboard');

        if (isDesktop) {
            menu.innerHTML = `
                <div class="context-menu-item" onclick="Hub.openApp('settings')">
                    <i class="fas fa-desktop"></i> Personalize
                </div>
                <div class="context-menu-item" onclick="Hub.openApp('notes')">
                    <i class="fas fa-sticky-note"></i> New Note
                </div>
                <div class="context-menu-divider"></div>
                <div class="context-menu-item" onclick="Hub.toggleTheme()">
                    <i class="fas fa-moon"></i> Toggle Theme
                </div>
                <div class="context-menu-item" onclick="location.reload()">
                    <i class="fas fa-sync"></i> Refresh System
                </div>
            `;
        } else if (e.target.closest('#sidebar-nav li')) {
            const appId = e.target.closest('li').getAttribute('data-app');
            const pinned = (Storage.load('pinned-apps') || []).includes(appId);
            menu.innerHTML = `
                <div class="context-menu-item" onclick="Hub.openApp('${appId}')">
                    <i class="fas fa-external-link-alt"></i> Open App
                </div>
                <div class="context-menu-item" onclick="Hub.togglePin('${appId}')">
                    <i class="fas fa-thumbtack"></i> ${pinned ? 'Unpin from Dash' : 'Pin to Dash'}
                </div>
            `;
        } else {
            // Generic context menu for other areas if needed
            menu.innerHTML = `
                <div class="context-menu-item" onclick="Hub.closeAllWindows()">
                    <i class="fas fa-window-close"></i> Close All Windows
                </div>
            `;
        }

        menu.style.display = 'block';
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';

        // Adjust position if it goes off screen
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 5) + 'px';
        if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 5) + 'px';
    },

    hideContextMenu() {
        const menu = document.getElementById('context-menu');
        if (menu) menu.style.display = 'none';
    },

    closeAllWindows() {
        [...this.windows].forEach(win => this.closeWindow(win.id));
    },

    togglePin(appId) {
        let pinned = Storage.load('pinned-apps') || [];
        if (pinned.includes(appId)) {
            pinned = pinned.filter(id => id !== appId);
            Utils.showToast(`Unpinned ${appId}`, 'info');
        } else {
            pinned.push(appId);
            Utils.showToast(`Pinned ${appId} to Dashboard`, 'success');
        }
        Storage.save('pinned-apps', pinned);
        this.populateDashboard();
        this.hideContextMenu();
    },

    showSnapPreview(side) {
        let preview = document.getElementById('snap-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'snap-preview';
            document.getElementById('workspace').appendChild(preview);
        }
        preview.className = `snap-preview-${side}`;
        preview.style.display = 'block';
    },

    hideSnapPreview() {
        const preview = document.getElementById('snap-preview');
        if (preview) preview.style.display = 'none';
    },

    snapWindow(winEl, side) {
        const win = this.windows.find(w => w.el === winEl);
        if (!win) return;

        if (side === 'maximize') {
            this.maximizeWindow(win.id);
            return;
        }

        win.oldTop = winEl.style.top;
        win.oldLeft = winEl.style.left;
        win.oldWidth = winEl.style.width;
        win.oldHeight = winEl.style.height;

        winEl.classList.add('snapped');
        winEl.style.top = '0';
        winEl.style.height = '100%';
        winEl.style.width = '50%';

        if (side === 'left') {
            winEl.style.left = '0';
        } else if (side === 'right') {
            winEl.style.left = '50%';
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

                let newTop = winEl.offsetTop - pos2;
                let newLeft = winEl.offsetLeft - pos1;

                winEl.style.top = newTop + "px";
                winEl.style.left = newLeft + "px";
                winEl.style.transition = 'none';

                // Visual feedback for Aero Snap
                const workspace = document.getElementById('workspace').getBoundingClientRect();
                if (e.clientX < 10) {
                    this.showSnapPreview('left');
                } else if (e.clientX > window.innerWidth - 10) {
                    this.showSnapPreview('right');
                } else if (e.clientY < 10) {
                    this.showSnapPreview('top');
                } else {
                    this.hideSnapPreview();
                }
            };

            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                winEl.style.transition = '';
                this.hideSnapPreview();

                const workspace = document.getElementById('workspace').getBoundingClientRect();

                if (e.clientX < 20) {
                    this.snapWindow(winEl, 'left');
                } else if (e.clientX > window.innerWidth - 20) {
                    this.snapWindow(winEl, 'right');
                } else if (e.clientY < 20) {
                    this.snapWindow(winEl, 'maximize');
                } else {
                    // Snapping to screen edges (bounds check)
                    const rect = winEl.getBoundingClientRect();
                    if (rect.top < 0) winEl.style.top = '0px';
                    if (rect.left < 0) winEl.style.left = '0px';
                    if (rect.right > workspace.right) winEl.style.left = (workspace.width - rect.width) + 'px';
                }
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
