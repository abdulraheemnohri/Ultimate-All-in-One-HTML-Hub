/**
 * User Manager App - Administrative Tool
 */

const UserManagerApp = {
    init(containerId, params = {}) {
        this.containerId = containerId;
        this.render();
        return () => this.cleanup();
    },

    render() {
        const container = document.getElementById(this.containerId);
        if (!Storage.isAdmin()) {
            container.innerHTML = `
                <div class="user-manager-error">
                    <i class="fas fa-lock fa-3x"></i>
                    <h2>Access Denied</h2>
                    <p>Only the 'default' account can access the User Manager.</p>
                </div>
                <style>
                    .user-manager-error { text-align: center; padding: 40px; color: #ff5f56; }
                </style>
            `;
            return;
        }

        const users = Storage.listUsers();

        container.innerHTML = `
            <div class="user-manager">
                <div class="um-header">
                    <h2>Account Management</h2>
                    <button class="um-add-btn" onclick="UserManagerApp.promptAdd()"><i class="fas fa-user-plus"></i> Create New User</button>
                </div>

                <div class="user-table-container">
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td><i class="fas fa-user-circle"></i> ${user.charAt(0).toUpperCase() + user.slice(1)}</td>
                                    <td>${user === 'default' ? '<span class="badge admin">Admin</span>' : '<span class="badge">Standard</span>'}</td>
                                    <td>
                                        ${user !== 'default' ? `
                                            <button class="action-btn delete" onclick="UserManagerApp.delete('${user}')" title="Delete Account"><i class="fas fa-trash-alt"></i></button>
                                            <button class="action-btn reset" onclick="UserManagerApp.resetPin('${user}')" title="Reset PIN"><i class="fas fa-key"></i></button>
                                        ` : '<span class="no-actions">No Actions</span>'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>
                .user-manager { padding: 10px; color: var(--text-primary); }
                .um-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .um-add-btn { background: var(--accent-color); color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; }
                .user-table-container { background: rgba(0,0,0,0.05); border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); }
                .user-table { width: 100%; border-collapse: collapse; }
                .user-table th { background: rgba(0,0,0,0.1); padding: 12px; text-align: left; font-size: 0.85rem; text-transform: uppercase; opacity: 0.7; }
                .user-table td { padding: 12px; border-bottom: 1px solid var(--border-color); font-size: 0.95rem; }
                .user-table tr:last-child td { border-bottom: none; }
                .user-table i { margin-right: 8px; color: var(--accent-color); opacity: 0.8; }

                .badge { padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); }
                .badge.admin { background: rgba(0, 120, 212, 0.1); color: var(--accent-color); border-color: var(--accent-color); }

                .action-btn { background: none; border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 4px; cursor: pointer; color: var(--text-primary); transition: 0.2s; margin-right: 5px; }
                .action-btn.delete:hover { background: #ff5f56; color: white; border-color: #ff5f56; }
                .action-btn.reset:hover { background: #ffbd2e; color: black; border-color: #ffbd2e; }
                .no-actions { font-size: 0.8rem; opacity: 0.5; font-style: italic; }
            </style>
        `;
    },

    promptAdd() {
        const name = prompt("Enter username for new account:");
        if (name && name.trim()) {
            const pin = prompt("Set a 4-digit PIN (default 1234):", "1234");
            if (Storage.addUser(name.trim().toLowerCase(), pin || "1234")) {
                Utils.showToast(`User ${name} created successfully`, 'success');
                this.render();
            } else {
                Utils.showToast("Failed to create user. Name might already exist.", 'danger');
            }
        }
    },

    delete(username) {
        if (confirm(`Are you sure you want to delete account '${username}'? This will erase all data for this user.`)) {
            if (Storage.deleteUser(username)) {
                Utils.showToast(`User ${username} deleted`, 'info');
                this.render();
            } else {
                Utils.showToast("Failed to delete user.", 'danger');
            }
        }
    },

    resetPin(username) {
        const newPin = prompt(`Enter new 4-digit PIN for '${username}':`, "1234");
        if (newPin && newPin.length === 4) {
            localStorage.setItem(`hub_${username.toLowerCase()}_lock-passcode`, JSON.stringify(newPin));
            Utils.showToast(`PIN for ${username} reset successfully`, 'success');
        } else if (newPin !== null) {
            Utils.showToast("Invalid PIN. Must be 4 digits.", 'warning');
        }
    },

    cleanup() {}
};
