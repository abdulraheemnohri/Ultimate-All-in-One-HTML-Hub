/**
 * Soundboard App
 */

const SoundboardApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.sounds = [
            { name: "Notification", url: "assets/sounds/notification.mp3" },
            { name: "Success", url: "assets/sounds/success.mp3" },
            { name: "Error", url: "assets/sounds/error.mp3" },
            { name: "Applause", url: "https://www.soundjay.com/human/applause-01.mp3" },
            { name: "Ding", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" }
        ];
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="soundboard-app">
                <div class="sound-grid">
                    ${this.sounds.map((s, i) => `
                        <button class="sound-btn" onclick="SoundboardApp.play(${i})">
                            <i class="fas fa-volume-up"></i>
                            <span>${s.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            <style>
                .soundboard-app { padding: 20px; }
                .sound-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; }
                .sound-btn {
                    display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 10px;
                    background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px;
                    cursor: pointer; transition: 0.2s; color: var(--text-color);
                }
                .sound-btn:hover { background: var(--accent-color); color: white; transform: translateY(-3px); }
                .sound-btn i { font-size: 1.5rem; }
                .sound-btn span { font-size: 0.8rem; font-weight: bold; }
            </style>
        `;
    },

    play(index) {
        const audio = new Audio(this.sounds[index].url);
        audio.play().catch(e => alert("Could not play sound: " + e.message));
    }
};
