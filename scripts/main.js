/**
 * Ultimate All-in-One HTML Hub - Main Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    await VFS.init();
    Hub.init();
});

const Hub = {
    apps: {},
    windows: [],
    activeWindow: null,
    zIndexCounter: 100,
    appCleanups: {},
    currentWorkspace: 0,
    workspaces: [[], []],

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        ExtensionManager.init();
        this.setupEventListeners();
        this.registerServiceWorker();
        this.populateDashboard();
        this.renderDesktopIcons();
        this.renderWidgets();
        this.applySettings();
        this.handleStartupApps();
        // LockScreen v5
        const user = Storage.getUser();
        if (Storage.load('lock-enabled') || !localStorage.getItem('hub_current_user')) {
            this.ensureAppLoaded('lockscreen').then(() => {
                LockScreen.init();
            });
        }
        console.log(`Hub Initialized for user: ${user}`);
    },

    handleStartupApps() {
        const startup = Storage.load('startup-apps') || [];
        startup.forEach(appId => {
            setTimeout(() => this.openApp(appId), 500);
        });
    },

    applySettings() {
        const accent = Storage.load('accent-color');
        if (accent) document.documentElement.style.setProperty('--accent-color', accent);

        const blur = Storage.load('glass-blur');
        if (blur) document.documentElement.style.setProperty('--glass-effect', `blur(${blur}px)`);

        const skin = Storage.load('skin') || 'default';
        this.setSkin(skin);
    },

    setSkin(skin) {
        document.body.classList.remove('retro-skin', 'cyber-skin', 'holo-skin', 'eink-skin');
        if (skin !== 'default') document.body.classList.add(`${skin}-skin`);
        Storage.save('skin', skin);
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
        this.stopLiveWallpaper();

        if (wp === 'matrix') {
            this.startLiveWallpaper('matrix');
        } else if (wp === 'particles') {
            this.startLiveWallpaper('particles');
        } else if (wp.startsWith('http') || wp.startsWith('data:')) {
            workspace.style.backgroundImage = `url('${wp}')`;
            workspace.style.backgroundColor = '';
        } else {
            workspace.style.backgroundImage = 'none';
            workspace.style.background = wp;
        }
        Storage.save('wallpaper', wp);
    },

    startLiveWallpaper(type) {
        const workspace = document.getElementById('workspace');
        let canvas = document.getElementById('live-wallpaper-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'live-wallpaper-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '0';
            workspace.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        canvas.width = workspace.offsetWidth;
        canvas.height = workspace.offsetHeight;

        if (type === 'matrix') {
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const fontSize = 16;
            const columns = canvas.width / fontSize;
            const drops = Array(Math.floor(columns)).fill(1);

            this.liveWallpaperInterval = setInterval(() => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }, 33);
        } else if (type === 'particles') {
            const particles = Array(100).fill().map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3
            }));

            this.liveWallpaperInterval = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }, 33);
        }
    },

    stopLiveWallpaper() {
        if (this.liveWallpaperInterval) {
            clearInterval(this.liveWallpaperInterval);
            this.liveWallpaperInterval = null;
        }
        const canvas = document.getElementById('live-wallpaper-canvas');
        if (canvas) canvas.remove();
    },

    renderDesktopIcons() {
        const workspace = document.getElementById('workspace');
        // Remove existing icons
        workspace.querySelectorAll('.desktop-icon').forEach(el => el.remove());

        const defaultIcons = [
            { id: 'todo', name: 'My Tasks', icon: 'fa-check-double', x: 20, y: 20 },
            { id: 'notes', name: 'Notes', icon: 'fa-sticky-note', x: 20, y: 120 },
            { id: 'file-manager', name: 'Files', icon: 'fa-folder-open', x: 20, y: 220 },
            { id: 'games', name: 'Arcade', icon: 'fa-gamepad', x: 20, y: 320 }
        ];

        const savedIcons = Storage.load('desktop-icons') || defaultIcons;

        savedIcons.forEach(icon => {
            const el = document.createElement('div');
            el.className = 'desktop-icon';
            el.id = `icon-${icon.id}`;
            el.style.left = icon.x + 'px';
            el.style.top = icon.y + 'px';
            el.innerHTML = `
                <i class="fas ${icon.icon}"></i>
                <span>${icon.name}</span>
            `;
            el.ondblclick = () => this.openApp(icon.id);
            el.onclick = (e) => {
                e.stopPropagation();
                workspace.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
                el.classList.add('selected');
            };
            workspace.appendChild(el);
            this.setupIconDragging(el, icon.id);
        });
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

    async filterApps(query) {
        query = query.toLowerCase();
        const sidebarNav = document.getElementById('sidebar-nav');

        // Remove existing global search results
        const existingResults = document.getElementById('global-search-results');
        if (existingResults) existingResults.remove();

        if (!query) {
            sidebarNav.style.display = 'block';
            document.querySelectorAll('#sidebar-nav li').forEach(li => li.style.display = 'block');
            document.querySelectorAll('.nav-group').forEach(g => g.style.display = 'block');
            return;
        }

        sidebarNav.style.display = 'none';

        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'global-search-results';
        resultsDiv.className = 'nav-group';
        resultsDiv.innerHTML = '<h3>Search Results</h3><ul id="search-results-list"></ul>';
        sidebarNav.parentElement.insertBefore(resultsDiv, sidebarNav.nextSibling);
        const list = resultsDiv.querySelector('ul');

        // 1. Search Apps
        document.querySelectorAll('#sidebar-nav li').forEach(item => {
            const text = item.textContent.toLowerCase();
            const appId = item.getAttribute('data-app');
            if (text.includes(query)) {
                const li = document.createElement('li');
                li.innerHTML = item.innerHTML;
                li.onclick = () => this.openApp(appId);
                list.appendChild(li);
            }
        });

        // 2. Search VFS Files
        const allFiles = await this.searchVFS(query);
        allFiles.forEach(file => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas ${file.type === 'directory' ? 'fa-folder' : 'fa-file'}"></i> ${file.name}`;
            li.onclick = () => {
                if (file.type === 'directory') {
                    this.openApp('file-manager', { path: file.path });
                } else {
                    const appId = VFS.getAssociation(file.name);
                    this.openApp(appId, { file: file.path });
                }
            };
            list.appendChild(li);
        });

        if (list.children.length === 0) {
            list.innerHTML = '<li style="opacity:0.5">No results found</li>';
        }
    },

    async searchVFS(query, path = '/') {
        let results = [];
        const files = await VFS.listFiles(path);
        for (const file of files) {
            if (file.name.toLowerCase().includes(query)) {
                results.push(file);
            }
            if (file.type === 'directory') {
                const subResults = await this.searchVFS(query, file.path);
                results = results.concat(subResults);
            }
        }
        return results;
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

    openApp(appId, params = {}) {
        // Check if app already open
        const existingWindow = this.windows.find(w => w.appId === appId);
        if (existingWindow) {
            this.focusWindow(existingWindow.el);
            if (params.file) {
                // If opening a file, pass it to the app if it's already open
                const appInstance = window[this.getAppClassName(appId)];
                if (appInstance && appInstance.loadFile) {
                    appInstance.loadFile(params.file);
                }
            }
            return;
        }

        this.createWindow(appId, params);
    },

    getAppClassName(appId) {
        const mapping = {
            'todo': 'TodoApp', 'habits': 'HabitTrackerApp', 'pomodoro': 'PomodoroApp', 'notes': 'NotesApp',
            'calendar': 'CalendarApp', 'finance': 'FinanceApp', 'checklist': 'ChecklistApp',
            'reading-list': 'ReadingListApp', 'planner': 'PlannerApp', 'recipes': 'RecipeApp', 'goals': 'GoalTrackerApp',
            'sketchpad': 'SketchpadApp', 'meme-gen': 'MemeApp', 'palette': 'PaletteApp',
            'typography': 'TypographyApp', 'pixelart': 'PixelArtApp', 'logodesign': 'LogoApp',
            'photo-edit': 'PhotoEditApp', 'collage': 'CollageApp', 'quiz': 'QuizApp',
            'flashcards': 'FlashcardsApp', 'typing': 'TypingApp', 'math': 'MathApp', 'vocab': 'VocabApp',
            'games': 'GamesApp', 'minesweeper': 'MinesweeperApp', 'hangman': 'HangmanApp',
            'memory': 'MemoryApp', 'rps': 'RPSApp', 'audio-player': 'AudioPlayerApp',
            'video-player': 'VideoPlayerApp', 'soundboard': 'SoundboardApp', 'calculator': 'CalculatorApp',
            'converter': 'ConverterApp', 'qrcode': 'QRCodeApp', 'text-utils': 'TextUtilsApp',
            'pass-gen': 'PassGenApp', 'timezone': 'TimezoneApp', 'lorem': 'LoremApp',
            'voice-rec': 'VoiceRecApp', 'mini-browser': 'MiniBrowserApp', 'markdown': 'MarkdownApp',
            'file-manager': 'FileManagerApp', 'analytics': 'AnalyticsApp', 'sysmon': 'SysMonApp',
            'weather': 'WeatherApp', 'news': 'NewsApp', 'terminal': 'TerminalApp',
            'assistant': 'AssistantApp', 'mixer': 'MixerApp', 'taskman': 'TaskmanApp', 'lockscreen': 'LockScreen',
            'code-editor': 'CodeEditorApp', 'app-store': 'AppStoreApp'
        };
        return mapping[appId] || appId;
    },

    async createWindow(appId, params = {}) {
        const appName = this.getAppName(appId);
        const windowId = `window-${Utils.generateId()}`;
        this.workspaces[this.currentWorkspace].push(windowId);

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

        // Dynamic Loading Logic
        try {
            await this.ensureAppLoaded(appId);
            const cleanup = this.loadAppContent(appId, `content-${windowId}`, params);
            if (typeof cleanup === 'function') {
                this.appCleanups[windowId] = cleanup;
            }
        } catch (error) {
            console.error(`Failed to load app: ${appId}`, error);
            document.getElementById(`content-${windowId}`).innerHTML = `<p class="error">Error loading ${appName}. Please check your connection.</p>`;
        }

        this.setupWindowInteractions(winEl);
    },

    loadedScripts: new Set(),
    async ensureAppLoaded(appId) {
        if (appId === 'settings' || appId === 'lockscreen') {
             // Settings is built-in to Hub for now, but lockscreen is external
             if (appId === 'settings') return;
        }

        const scriptPath = this.getAppScript(appId);
        if (this.loadedScripts.has(scriptPath)) return;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                this.loadedScripts.add(scriptPath);
                resolve();
            };
            script.onerror = reject;
            document.body.appendChild(script);
        });
    },

    getAppScript(appId) {
        if (this.extensionUrls && this.extensionUrls[appId]) {
            return this.extensionUrls[appId];
        }

        const mapping = {
            'todo': 'todo', 'habits': 'habits', 'pomodoro': 'pomodoro', 'notes': 'notes',
            'calendar': 'calendar', 'finance': 'finance', 'checklist': 'checklist',
            'reading-list': 'books', 'planner': 'planner', 'recipes': 'recipes', 'goals': 'goals',
            'sketchpad': 'sketchpad', 'meme-gen': 'meme-gen', 'palette': 'palette',
            'typography': 'typography', 'pixelart': 'pixelart', 'logodesign': 'logodesign',
            'photo-edit': 'photo-edit', 'collage': 'collage', 'quiz': 'quiz',
            'flashcards': 'flashcards', 'typing': 'typing', 'math': 'math', 'vocab': 'vocab',
            'games': 'games', 'minesweeper': 'minesweeper', 'hangman': 'hangman',
            'memory': 'memory', 'rps': 'rps', 'audio-player': 'audio-player',
            'video-player': 'video-player', 'soundboard': 'soundboard', 'calculator': 'calculator',
            'converter': 'converter', 'qrcode': 'qrcode', 'text-utils': 'textutils',
            'pass-gen': 'passgen', 'timezone': 'timezone', 'lorem': 'lorem',
            'voice-rec': 'voicerec', 'mini-browser': 'mini-browser', 'markdown': 'markdown',
            'file-manager': 'fileman', 'analytics': 'analytics', 'sysmon': 'sysmon',
            'weather': 'weather', 'news': 'news', 'terminal': 'terminal',
            'assistant': 'assistant', 'mixer': 'mixer', 'taskman': 'taskman', 'lockscreen': 'lockscreen',
            'code-editor': 'code-editor', 'app-store': 'app-store', 'photo-studio': 'photo-studio', 'beat-maker': 'beat-maker',
            'cloud-hub': 'cloud-hub'
        };
        const scriptName = mapping[appId] || appId;
        return `scripts/apps/${scriptName}.js`;
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

            // Remove from workspaces
            this.workspaces.forEach((ws, i) => {
                this.workspaces[i] = ws.filter(id => id !== windowId);
            });

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
            win.el.classList.add('minimized');
            setTimeout(() => {
                if (win.el.classList.contains('minimized')) {
                    win.el.style.display = 'none';
                }
            }, 300);
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
            if (winObj.el.classList.contains('minimized')) {
                winObj.el.style.display = 'flex';
                setTimeout(() => {
                    winObj.el.classList.remove('minimized');
                }, 10);
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

    loadAppContent(appId, containerId, params = {}) {
        const container = document.getElementById(containerId);

        switch(appId) {
            case 'todo':
                return TodoApp.init(containerId, params);
            case 'pomodoro':
                return PomodoroApp.init(containerId, params);
            case 'habits':
                return HabitTrackerApp.init(containerId, params);
            case 'checklist':
                return ChecklistApp.init(containerId, params);
            case 'reading-list':
                return ReadingListApp.init(containerId, params);
            case 'planner':
                return PlannerApp.init(containerId, params);
            case 'recipes':
                return RecipeApp.init(containerId, params);
            case 'goals':
                return GoalTrackerApp.init(containerId, params);
            case 'notes':
                return NotesApp.init(containerId, params);
            case 'calendar':
                return CalendarApp.init(containerId, params);
            case 'finance':
                return FinanceApp.init(containerId, params);
            case 'sketchpad':
                return SketchpadApp.init(containerId, params);
            case 'meme-gen':
                return MemeApp.init(containerId, params);
            case 'palette':
                return PaletteApp.init(containerId, params);
            case 'typography':
                return TypographyApp.init(containerId, params);
            case 'pixelart':
                return PixelArtApp.init(containerId, params);
            case 'logodesign':
                return LogoApp.init(containerId, params);
            case 'photo-edit':
                return PhotoEditApp.init(containerId, params);
            case 'collage':
                return CollageApp.init(containerId, params);
            case 'quiz':
                return QuizApp.init(containerId, params);
            case 'flashcards':
                return FlashcardsApp.init(containerId, params);
            case 'typing':
                return TypingApp.init(containerId, params);
            case 'math':
                return MathApp.init(containerId, params);
            case 'vocab':
                return VocabApp.init(containerId, params);
            case 'calculator':
                return CalculatorApp.init(containerId, params);
            case 'converter':
                return ConverterApp.init(containerId, params);
            case 'qrcode':
                return QRCodeApp.init(containerId, params);
            case 'text-utils':
                return TextUtilsApp.init(containerId, params);
            case 'pass-gen':
                return PassGenApp.init(containerId, params);
            case 'timezone':
                return TimezoneApp.init(containerId, params);
            case 'lorem':
                return LoremApp.init(containerId, params);
            case 'voice-rec':
                return VoiceRecApp.init(containerId, params);
            case 'soundboard':
                return SoundboardApp.init(containerId, params);
            case 'audio-player':
                return AudioPlayerApp.init(containerId, params);
            case 'video-player':
                return VideoPlayerApp.init(containerId, params);
            case 'mini-browser':
                return MiniBrowserApp.init(containerId, params);
            case 'markdown':
                return MarkdownApp.init(containerId, params);
            case 'file-manager':
                return FileManagerApp.init(containerId, params);
            case 'minesweeper':
                return MinesweeperApp.init(containerId, params);
            case 'hangman':
                return HangmanApp.init(containerId, params);
            case 'memory':
                return MemoryApp.init(containerId, params);
            case 'rps':
                return RPSApp.init(containerId, params);
            case 'analytics':
                return AnalyticsApp.init(containerId, params);
            case 'sysmon':
                return SysMonApp.init(containerId, params);
            case 'weather':
                return WeatherApp.init(containerId, params);
            case 'news':
                return NewsApp.init(containerId, params);
            case 'terminal':
                return TerminalApp.init(containerId, params);
            case 'assistant':
                return AssistantApp.init(containerId, params);
            case 'mixer':
                return MixerApp.init(containerId, params);
            case 'taskman':
                return TaskmanApp.init(containerId, params);
            case 'games':
                return GamesApp.init(containerId, params);
            case 'code-editor':
                return CodeEditorApp.init(containerId, params);
            case 'app-store':
                return AppStoreApp.init(containerId, params);
            case 'photo-studio':
                return PhotoStudioApp.init(containerId, params);
            case 'beat-maker':
                return BeatMakerApp.init(containerId, params);
            case 'cloud-hub':
                return CloudHubApp.init(containerId, params);
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
        const skin = Storage.load('skin') || 'default';
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
                        <div class="wp-preset" style="background: #000; color: #0f0; display:flex; align-items:center; justify-content:center; font-size:10px;" onclick="Hub.setWallpaper('matrix')">MTX</div>
                        <div class="wp-preset" style="background: #333; color: #fff; display:flex; align-items:center; justify-content:center; font-size:10px;" onclick="Hub.setWallpaper('particles')">PRT</div>
                    </div>

                    <div style="margin-top: 15px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
                        <div>
                            <p>Accent Color</p>
                            <input type="color" id="accent-picker" value="${accent}" onchange="Hub.changeAccent(this.value)">
                        </div>
                        <div>
                            <p>Glass Blur (px)</p>
                            <input type="range" min="0" max="30" value="${blur}" oninput="Hub.changeBlur(this.value)">
                        </div>
                        <div>
                            <p>System Skin</p>
                            <select onchange="Hub.setSkin(this.value)" style="padding: 5px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
                                <option value="default" ${skin === 'default' ? 'selected' : ''}>Default Glass</option>
                                <option value="retro" ${skin === 'retro' ? 'selected' : ''}>Retro Win95</option>
                                <option value="cyber" ${skin === 'cyber' ? 'selected' : ''}>Cyberpunk Neon</option>
                                <option value="holo" ${skin === 'holo' ? 'selected' : ''}>Holographic</option>
                                <option value="eink" ${skin === 'eink' ? 'selected' : ''}>E-Ink Reader</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section style="margin-top: 20px;">
                    <h3>Security & Startup</h3>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="lock-toggle" ${lockEnabled ? 'checked' : ''} onchange="Hub.toggleLock(this.checked)">
                        <label for="lock-toggle">Enable Lock Screen (PIN: 1234)</label>
                    </div>
                    <div style="margin-top: 10px;">
                        <p>Startup Apps (Comma separated IDs)</p>
                        <input type="text" id="startup-apps-input" value="${(Storage.load('startup-apps') || []).join(', ')}" placeholder="e.g. todo, sysmon" onchange="Hub.updateStartupApps(this.value)">
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
                    <p>Ultimate All-in-One HTML Hub v5.0 (Platinum Edition)</p>
                    <p>The absolute peak of vanilla web productivity.</p>
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

    updateStartupApps(val) {
        const apps = val.split(',').map(s => s.trim()).filter(s => s);
        Storage.save('startup-apps', apps);
        Utils.showToast('Startup apps updated', 'success');
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

    setupIconDragging(el, appId) {
        el.onmousedown = (e) => {
            if (e.button !== 0) return;
            e.preventDefault();

            let pos1 = 0, pos2 = 0, pos3 = e.clientX, pos4 = e.clientY;
            let moved = false;

            document.onmousemove = (e) => {
                e.preventDefault();
                moved = true;
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;

                if (moved) {
                    this.saveIconPositions();
                }
            };
        };
    },

    saveIconPositions() {
        const icons = [];
        document.querySelectorAll('.desktop-icon').forEach(el => {
            icons.push({
                id: el.id.replace('icon-', ''),
                name: el.querySelector('span').textContent,
                icon: el.querySelector('i').className.replace('fas ', ''),
                x: el.offsetLeft,
                y: el.offsetTop
            });
        });
        Storage.save('desktop-icons', icons);
    },

    switchWorkspace(index) {
        if (this.currentWorkspace === index) return;

        // Hide current workspace windows
        this.workspaces[this.currentWorkspace].forEach(id => {
            const win = this.windows.find(w => w.id === id);
            if (win) win.el.style.display = 'none';
        });

        this.currentWorkspace = index;

        // Show new workspace windows
        this.workspaces[this.currentWorkspace].forEach(id => {
            const win = this.windows.find(w => w.id === id);
            if (win && !win.el.classList.contains('minimized')) {
                win.el.style.display = 'flex';
            }
        });

        // Update UI
        document.querySelectorAll('#workspace-switcher button').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        Utils.showToast(`Switched to Workspace ${index + 1}`, 'info');
    },

    renderWidgets() {
        const container = document.getElementById('desktop-widgets');
        container.innerHTML = '';
        const activeWidgets = Storage.load('active-widgets') || ['clock-widget', 'sys-widget'];

        activeWidgets.forEach(type => {
            const widget = document.createElement('div');
            widget.className = 'widget ' + type;
            if (type === 'clock-widget') {
                widget.innerHTML = `<div id="widget-clock">00:00</div><div id="widget-date">Date</div>`;
                this.startWidgetClock(widget);
            } else if (type === 'sys-widget') {
                widget.innerHTML = `<h4>System</h4><div class="stat">CPU: <span id="w-cpu">5%</span></div><div class="stat">RAM: <span id="w-ram">12%</span></div>`;
                this.startWidgetSys(widget);
            }
            container.appendChild(widget);
        });
    },

    startWidgetClock(el) {
        const update = () => {
            const now = new Date();
            const clock = el.querySelector('#widget-clock');
            const date = el.querySelector('#widget-date');
            if (clock) clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (date) date.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
        };
        update();
        setInterval(update, 60000);
    },

    startWidgetSys(el) {
        setInterval(() => {
            const cpu = el.querySelector('#w-cpu');
            const ram = el.querySelector('#w-ram');
            if (cpu) cpu.textContent = Math.floor(Math.random() * 15 + 2) + '%';
            if (ram) ram.textContent = Math.floor(Math.random() * 10 + 20) + '%';
        }, 3000);
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
