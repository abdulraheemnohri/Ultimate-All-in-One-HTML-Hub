/**
 * Beat Maker App v5 - Web Audio API Drum Machine
 */

const BeatMakerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.tempo = 120;
        this.step = 0;
        this.tracks = [
            { name: 'Kick', color: '#ff5f56', steps: Array(16).fill(false), freq: 150 },
            { name: 'Snare', color: '#ffbd2e', steps: Array(16).fill(false), freq: 400 },
            { name: 'Hi-Hat', color: '#27c93f', steps: Array(16).fill(false), freq: 1000 },
            { name: 'Clap', color: '#0078d4', steps: Array(16).fill(false), freq: 600 }
        ];
        this.render();
        return () => { this.stop(); };
    },

    render() {
        this.container.innerHTML = `
            <div class="beat-maker">
                <div class="bm-header">
                    <button id="bm-play" onclick="BeatMakerApp.togglePlay()"><i class="fas fa-play"></i> Play</button>
                    <input type="range" min="60" max="200" value="${this.tempo}" oninput="BeatMakerApp.updateTempo(this.value)">
                    <span id="bm-tempo">${this.tempo} BPM</span>
                    <button onclick="BeatMakerApp.clear()">Clear</button>
                </div>
                <div class="bm-grid" id="bm-grid"></div>
            </div>
            <style>
                .beat-maker { height: 100%; padding: 15px; display: flex; flex-direction: column; gap: 20px; }
                .bm-header { display: flex; align-items: center; gap: 15px; }
                .bm-header button { padding: 8px 15px; border: none; background: var(--accent-color); color: white; border-radius: 4px; cursor: pointer; }
                .bm-grid { display: flex; flex-direction: column; gap: 10px; }
                .bm-track { display: flex; align-items: center; gap: 10px; }
                .track-name { width: 60px; font-weight: bold; font-size: 0.8rem; }
                .steps { display: flex; gap: 4px; flex-grow: 1; }
                .step { width: 30px; height: 30px; background: rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; }
                .step.active { background: var(--track-color); box-shadow: 0 0 10px var(--track-color); }
                .step.current { border: 2px solid white; }
            </style>
        `;

        this.renderGrid();
    },

    renderGrid() {
        const grid = this.container.querySelector('#bm-grid');
        grid.innerHTML = '';
        this.tracks.forEach((track, tIdx) => {
            const row = document.createElement('div');
            row.className = 'bm-track';
            row.style.setProperty('--track-color', track.color);
            row.innerHTML = `<div class="track-name">${track.name}</div>`;

            const stepsDiv = document.createElement('div');
            stepsDiv.className = 'steps';
            track.steps.forEach((active, sIdx) => {
                const step = document.createElement('div');
                step.className = `step ${active ? 'active' : ''}`;
                step.onclick = () => {
                    track.steps[sIdx] = !track.steps[sIdx];
                    step.classList.toggle('active');
                };
                stepsDiv.appendChild(step);
            });
            row.appendChild(stepsDiv);
            grid.appendChild(row);
        });
    },

    togglePlay() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    },

    start() {
        this.isPlaying = true;
        this.container.querySelector('#bm-play').innerHTML = '<i class="fas fa-stop"></i> Stop';
        this.nextStep();
    },

    stop() {
        this.isPlaying = false;
        this.container.querySelector('#bm-play').innerHTML = '<i class="fas fa-play"></i> Play';
        clearTimeout(this.timer);
        this.step = 0;
        this.updateVisuals();
    },

    nextStep() {
        if (!this.isPlaying) return;

        this.tracks.forEach(track => {
            if (track.steps[this.step]) this.playSound(track.freq);
        });

        this.updateVisuals();

        this.step = (this.step + 1) % 16;
        const interval = (60 / this.tempo) / 4 * 1000;
        this.timer = setTimeout(() => this.nextStep(), interval);
    },

    updateVisuals() {
        const rows = this.container.querySelectorAll('.bm-track');
        rows.forEach(row => {
            const steps = row.querySelectorAll('.step');
            steps.forEach((s, idx) => {
                s.classList.toggle('current', idx === this.step && this.isPlaying);
            });
        });
    },

    playSound(freq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    updateTempo(v) {
        this.tempo = v;
        this.container.querySelector('#bm-tempo').textContent = `${v} BPM`;
    },

    clear() {
        this.tracks.forEach(t => t.steps.fill(false));
        this.renderGrid();
    }
};
