/**
 * Extension Manager v5 - Third-party App Integration
 */

const ExtensionManager = {
    extensions: [],

    init() {
        this.extensions = Storage.load('extensions') || [];
        this.registerExtensions();
    },

    registerExtensions() {
        this.extensions.forEach(ext => {
            this.addToSidebar(ext);
        });
    },

    addToSidebar(ext) {
        // Find a suitable group or create 'Extensions' group
        let group = document.querySelector('.nav-group.extensions-group');
        if (!group) {
            group = document.createElement('div');
            group.className = 'nav-group extensions-group';
            group.innerHTML = '<h3>Extensions</h3><ul></ul>';
            document.getElementById('sidebar-nav').appendChild(group);

            // Setup toggle logic for new group
            const header = group.querySelector('h3');
            header.onclick = () => {
                group.classList.toggle('collapsed');
                const icon = header.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-right');
                }
            };
            header.innerHTML = `<i class="fas fa-chevron-down collapse-icon"></i> ` + header.innerHTML;
        }

        const list = group.querySelector('ul');
        const li = document.createElement('li');
        li.setAttribute('data-app', ext.id);
        li.innerHTML = `<i class="fas ${ext.icon || 'fa-puzzle-piece'}"></i> ${ext.name}`;
        li.onclick = () => Hub.openApp(ext.id);
        list.appendChild(li);

        // Register in Hub loaded scripts if it's external
        if (ext.url) {
            Hub.extensionUrls = Hub.extensionUrls || {};
            Hub.extensionUrls[ext.id] = ext.url;
        }
    },

    async addExtension(url) {
        try {
            const response = await fetch(url);
            const manifest = await response.json();

            if (!manifest.id || !manifest.name) throw new Error("Invalid manifest");

            if (confirm(`Do you want to install extension "${manifest.name}"?`)) {
                const ext = {
                    id: manifest.id,
                    name: manifest.name,
                    icon: manifest.icon,
                    url: manifest.scriptUrl || url.replace('manifest.json', 'app.js')
                };

                this.extensions.push(ext);
                Storage.save('extensions', this.extensions);
                this.addToSidebar(ext);
                Utils.showToast(`Extension ${ext.name} installed!`, 'success');
            }
        } catch (e) {
            console.error("Extension install failed", e);
            Utils.showToast("Failed to load extension manifest.", "danger");
        }
    }
};

// Update Hub to handle extension URLs
const originalGetAppScript = Hub.getAppScript.bind(Hub);
Hub.getAppScript = function(appId) {
    if (this.extensionUrls && this.extensionUrls[appId]) {
        return this.extensionUrls[appId]; // Return full URL if extension
    }
    return originalGetAppScript(appId);
};
