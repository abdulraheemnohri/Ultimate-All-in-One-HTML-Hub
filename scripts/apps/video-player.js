const VideoPlayerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {
            const video = document.getElementById('video-element');
            if (video) {
                video.pause();
                video.src = "";
                video.load();
            }
        };
    },

    render() {
        this.container.innerHTML = `
            <div class="video-app">
                <div class="video-container">
                    <video id="video-element" controls style="width:100%; max-height: 400px; background: #000;"></video>
                </div>
                <div class="video-controls">
                    <input type="text" id="video-url" placeholder="Paste direct video URL (mp4, webm)...">
                    <button onclick="VideoPlayerApp.loadVideo()">Load</button>
                </div>
                <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 10px;">Note: Direct video links only. YouTube links require embedding logic.</p>
            </div>
            <style>
                .video-app { display: flex; flex-direction: column; gap: 15px; }
                .video-controls { display: flex; gap: 10px; }
                .video-controls input { flex-grow: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: transparent; color: inherit; }
                .video-controls button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
        `;
    },

    loadVideo() {
        const url = document.getElementById('video-url').value;
        if (url) {
            const video = document.getElementById('video-element');
            video.src = url;
            video.play();
        }
    }
};
