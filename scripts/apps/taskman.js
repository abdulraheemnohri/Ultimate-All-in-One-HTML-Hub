/**
 * Task Manager App
 */

const TaskmanApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.interval = setInterval(() => this.render(), 3000);
        return () => clearInterval(this.interval);
    },

    render() {
        const windows = Hub.windows;
        this.container.innerHTML = `
            <div class="taskman-app">
                <div class="taskman-summary">
                    <div class="stat-box">
                        <div class="stat-val">${windows.length}</div>
                        <div class="stat-label">Active Apps</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-val">${(JSON.stringify(localStorage).length / 1024).toFixed(1)}K</div>
                        <div class="stat-label">Data Cache</div>
                    </div>
                </div>
                <div class="task-list">
                    <div class="task-header">
                        <span>Application</span>
                        <span>Memory</span>
                        <span>Status</span>
                        <span>Action</span>
                    </div>
                    ${windows.map(win => `
                        <div class="task-row">
                            <span class="task-name"><i class="fas ${Hub.getAppInfo(win.appId)?.icon || 'fa-window-maximize'}"></i> ${Hub.getAppName(win.appId)}</span>
                            <span class="task-mem">${Math.floor(Math.random() * 20 + 10)} MB</span>
                            <span class="task-status">Running</span>
                            <span class="task-action">
                                <button onclick="Hub.focusWindow(document.getElementById('${win.id}'))" title="Focus"><i class="fas fa-eye"></i></button>
                                <button onclick="Hub.closeWindow('${win.id}'); TaskmanApp.render()" title="Kill" class="kill-btn"><i class="fas fa-times"></i></button>
                            </span>
                        </div>
                    `).join('')}
                    ${windows.length === 0 ? '<div class="empty-tasks">No applications running.</div>' : ''}
                </div>
            </div>
            <style>
                .taskman-app { padding: 15px; }
                .taskman-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
                .stat-box { background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; text-align: center; }
                .stat-val { font-size: 1.5rem; font-weight: bold; color: var(--accent-color); }
                .stat-label { font-size: 0.8rem; opacity: 0.6; }
                .task-list { border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
                .task-header { background: rgba(0,0,0,0.1); padding: 10px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; font-size: 0.8rem; font-weight: bold; border-bottom: 1px solid var(--border-color); }
                .task-row { padding: 10px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; align-items: center; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); }
                .task-row:last-child { border-bottom: none; }
                .task-name i { width: 20px; color: var(--accent-color); }
                .task-status { color: #4caf50; font-size: 0.8rem; }
                .task-action { display: flex; gap: 8px; }
                .task-action button { background: none; border: none; cursor: pointer; color: var(--text-color); opacity: 0.6; transition: opacity 0.2s; }
                .task-action button:hover { opacity: 1; }
                .kill-btn:hover { color: #f44336 !important; }
                .empty-tasks { padding: 30px; text-align: center; opacity: 0.5; font-size: 0.9rem; }
            </style>
        `;
    }
};
