const AudioPlayerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.playlist = Storage.load('audio_playlist') || [];
        this.render();
        return () => {
            const audio = document.getElementById('audio-element');
            if (audio) {
                audio.pause();
                audio.src = "";
                audio.load();
            }
        };
    },

    render() {
        this.container.innerHTML = `
            <div class="audio-app">
                <div class="player-controls">
                    <audio id="audio-element" controls style="width:100%"></audio>
                </div>
                <div class="playlist-manager">
                    <h3>Playlist</h3>
                    <input type="text" id="audio-url" placeholder="Paste direct audio URL...">
                    <button onclick="AudioPlayerApp.addTrack()">Add Track</button>
                    <ul id="playlist-items">
                        ${this.playlist.map((track, i) => `
                            <li>
                                <span onclick="AudioPlayerApp.playTrack('${track.url}')">${track.name}</span>
                                <button onclick="AudioPlayerApp.removeTrack(${i})">x</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <style>
                .audio-app { display: flex; flex-direction: column; gap: 20px; }
                .playlist-manager ul { list-style: none; margin-top: 10px; }
                .playlist-manager li { display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid var(--border-color); }
                .playlist-manager li span { cursor: pointer; flex-grow: 1; }
                .playlist-manager input { padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: transparent; color: inherit; width: 200px; }
                .playlist-manager button { padding: 8px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
        `;
    },

    addTrack() {
        const url = document.getElementById('audio-url').value;
        if (url) {
            const name = url.split('/').pop() || 'Track ' + (this.playlist.length + 1);
            this.playlist.push({ name, url });
            Storage.save('audio_playlist', this.playlist);
            this.render();
        }
    },

    playTrack(url) {
        const audio = document.getElementById('audio-element');
        audio.src = url;
        audio.play();
    },

    removeTrack(index) {
        this.playlist.splice(index, 1);
        Storage.save('audio_playlist', this.playlist);
        this.render();
    }
};
