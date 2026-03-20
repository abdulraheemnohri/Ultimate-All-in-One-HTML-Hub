/**
 * Audio Mixer App
 */

const MixerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="mixer-app">
                <div class="mixer-channel">
                    <div class="channel-label"><i class="fas fa-desktop"></i> System Sounds</div>
                    <input type="range" min="0" max="100" value="70" oninput="MixerApp.updateVol('system', this.value)">
                    <span id="vol-system">70%</span>
                </div>
                <div class="mixer-channel">
                    <div class="channel-label"><i class="fas fa-music"></i> Media Player</div>
                    <input type="range" min="0" max="100" value="100" oninput="MixerApp.updateVol('media', this.value)">
                    <span id="vol-media">100%</span>
                </div>
                <div class="mixer-channel">
                    <div class="channel-label"><i class="fas fa-bell"></i> Notifications</div>
                    <input type="range" min="0" max="100" value="80" oninput="MixerApp.updateVol('notif', this.value)">
                    <span id="vol-notif">80%</span>
                </div>
                <div class="mixer-channel">
                    <div class="channel-label"><i class="fas fa-gamepad"></i> Games</div>
                    <input type="range" min="0" max="100" value="50" oninput="MixerApp.updateVol('games', this.value)">
                    <span id="vol-games">50%</span>
                </div>
                <hr>
                <div class="master-mute">
                    <button id="mute-btn" onclick="MixerApp.toggleMute()">
                        <i class="fas fa-volume-up"></i> Mute All
                    </button>
                </div>
            </div>
            <style>
                .mixer-app { padding: 20px; }
                .mixer-channel { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
                .channel-label { width: 140px; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
                .mixer-channel input { flex-grow: 1; accent-color: var(--accent-color); }
                .mixer-channel span { width: 45px; font-size: 0.8rem; opacity: 0.7; }
                hr { border: none; border-top: 1px solid var(--border-color); margin: 20px 0; }
                .master-mute { text-align: center; }
                .master-mute button { background: var(--accent-color); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 10px; margin: 0 auto; }
            </style>
        `;
    },

    updateVol(id, val) {
        document.getElementById(`vol-${id}`).textContent = val + '%';
        Storage.save(`vol-${id}`, val);
    },

    toggleMute() {
        const btn = document.getElementById('mute-btn');
        const icon = btn.querySelector('i');
        if (icon.classList.contains('fa-volume-up')) {
            icon.className = 'fas fa-volume-mute';
            btn.innerHTML = '<i class="fas fa-volume-mute"></i> Unmute All';
            btn.style.background = '#f44336';
            Utils.showToast('Audio Muted', 'warning');
        } else {
            icon.className = 'fas fa-volume-up';
            btn.innerHTML = '<i class="fas fa-volume-up"></i> Mute All';
            btn.style.background = 'var(--accent-color)';
            Utils.showToast('Audio Restored', 'success');
        }
    }
};
