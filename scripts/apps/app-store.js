/**
 * App Store - UI to manage integrated apps
 */

const AppStoreApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        const apps = this.getAppsList();
        this.container.innerHTML = `
            <div class="app-store">
                <header>
                    <h2>App Store</h2>
                    <p>Manage and launch hub applications</p>
                </header>
                <div class="store-grid">
                    ${apps.map(app => `
                        <div class="app-card">
                            <i class="fas ${app.icon}" style="color: ${app.color || 'var(--accent-color)'}"></i>
                            <div class="app-info">
                                <h3>${app.name}</h3>
                                <p>${app.category}</p>
                            </div>
                            <button onclick="Hub.openApp('${app.id}')">Launch</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            <style>
                .app-store { padding: 20px; height: 100%; overflow-y: auto; }
                .app-store header { margin-bottom: 25px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; }
                .store-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
                .app-card { background: var(--window-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 15px; }
                .app-card i { font-size: 2rem; width: 40px; text-align: center; }
                .app-card .app-info { flex-grow: 1; }
                .app-card h3 { font-size: 1rem; margin-bottom: 2px; }
                .app-card p { font-size: 0.8rem; opacity: 0.6; }
                .app-card button { background: var(--accent-color); color: white; border: none; padding: 6px 15px; border-radius: 6px; cursor: pointer; }
            </style>
        `;
    },

    getAppsList() {
        const list = [];
        document.querySelectorAll('#sidebar-nav li').forEach(li => {
            const appId = li.getAttribute('data-app');
            const icon = li.querySelector('i').className.replace('fas ', '');
            const name = li.textContent.trim();
            const category = li.closest('.nav-group').querySelector('h3').textContent.trim();
            list.push({ id: appId, icon, name, category });
        });
        return list;
    }
};
