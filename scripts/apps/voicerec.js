/**
 * Voice Recorder App
 */

const VoiceRecApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.chunks = [];
        this.recorder = null;
        this.render();
        return () => this.stop();
    },

    render() {
        this.container.innerHTML = `
            <div class="voicerec-app">
                <div class="recorder-status" id="rec-status">Ready to Record</div>
                <div class="recorder-controls">
                    <button id="rec-start" onclick="VoiceRecApp.start()"><i class="fas fa-microphone"></i> Start</button>
                    <button id="rec-stop" onclick="VoiceRecApp.stop()" disabled><i class="fas fa-stop"></i> Stop</button>
                </div>
                <div id="recordings-list" class="recordings-list"></div>
            </div>
            <style>
                .voicerec-app { padding: 30px; text-align: center; }
                .recorder-status { font-size: 1.2rem; margin-bottom: 25px; opacity: 0.7; }
                .recorder-status.recording { color: #f44336; font-weight: bold; opacity: 1; }
                .recorder-controls { display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; }
                .recorder-controls button {
                    padding: 15px 30px; border-radius: 30px; border: none;
                    background: var(--accent-color); color: white; cursor: pointer;
                    display: flex; align-items: center; gap: 10px; font-size: 1.1rem;
                }
                .recorder-controls button:disabled { opacity: 0.3; cursor: default; }
                #rec-stop { background: #f44336; }
                .recordings-list { display: flex; flex-direction: column; gap: 10px; align-items: center; }
                .rec-item { background: var(--bg-color); border: 1px solid var(--border-color); padding: 10px; border-radius: 8px; width: 100%; max-width: 300px; }
                .rec-item audio { width: 100%; }
            </style>
        `;
    },

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recorder = new MediaRecorder(stream);
            this.chunks = [];

            this.recorder.ondataavailable = (e) => this.chunks.push(e.data);
            this.recorder.onstop = () => this.saveRecording();

            this.recorder.start();
            document.getElementById('rec-status').textContent = "Recording...";
            document.getElementById('rec-status').classList.add('recording');
            document.getElementById('rec-start').disabled = true;
            document.getElementById('rec-stop').disabled = false;
        } catch (err) {
            alert("Error accessing microphone: " + err.message);
        }
    },

    stop() {
        if (this.recorder && this.recorder.state !== 'inactive') {
            this.recorder.stop();
            this.recorder.stream.getTracks().forEach(track => track.stop());
            document.getElementById('rec-status').textContent = "Ready to Record";
            document.getElementById('rec-status').classList.remove('recording');
            document.getElementById('rec-start').disabled = false;
            document.getElementById('rec-stop').disabled = true;
        }
    },

    saveRecording() {
        const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
        const url = URL.createObjectURL(blob);
        const item = document.createElement('div');
        item.className = 'rec-item';
        item.innerHTML = `
            <audio controls src="${url}"></audio>
            <div style="margin-top:5px; font-size: 0.8rem; opacity: 0.5;">Recorded at ${new Date().toLocaleTimeString()}</div>
        `;
        document.getElementById('recordings-list').prepend(item);
    }
};
