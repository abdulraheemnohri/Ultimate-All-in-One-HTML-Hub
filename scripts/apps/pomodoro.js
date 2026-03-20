/**
 * Pomodoro Timer App
 */

const PomodoroApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.loadState();
        this.updateDisplay();
        return () => this.cleanup();
    },

    render() {
        this.container.innerHTML = `
            <div class="pomodoro-app">
                <div class="timer-display">
                    <h2 id="pomodoro-time">25:00</h2>
                    <p id="timer-label">Session</p>
                </div>
                <div class="timer-controls">
                    <button id="pomodoro-start"><i class="fas fa-play"></i> Start</button>
                    <button id="pomodoro-pause" disabled><i class="fas fa-pause"></i> Pause</button>
                    <button id="pomodoro-reset"><i class="fas fa-undo"></i> Reset</button>
                </div>
                <div class="timer-settings">
                    <div class="setting-item">
                        <label>Work (min)</label>
                        <input type="number" id="work-duration" value="25" min="1" max="60">
                    </div>
                    <div class="setting-item">
                        <label>Break (min)</label>
                        <input type="number" id="break-duration" value="5" min="1" max="30">
                    </div>
                </div>
            </div>
            <style>
                .pomodoro-app { text-align: center; padding: 20px; }
                .timer-display { margin-bottom: 20px; }
                .timer-display h2 { font-size: 4rem; margin: 0; color: var(--accent-color); }
                .timer-display p { font-size: 1.2rem; opacity: 0.8; }
                .timer-controls { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; }
                .timer-controls button { padding: 10px 20px; border-radius: 20px; border: none; background: var(--accent-color); color: white; cursor: pointer; display: flex; align-items: center; gap: 5px; }
                .timer-controls button:disabled { opacity: 0.5; cursor: not-allowed; }
                .timer-settings { display: flex; justify-content: center; gap: 20px; }
                .setting-item { display: flex; flex-direction: column; align-items: center; }
                .setting-item input { width: 50px; padding: 5px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); margin-top: 5px; }
            </style>
        `;

        this.startBtn = document.getElementById('pomodoro-start');
        this.pauseBtn = document.getElementById('pomodoro-pause');
        this.resetBtn = document.getElementById('pomodoro-reset');
        this.display = document.getElementById('pomodoro-time');
        this.label = document.getElementById('timer-label');

        this.startBtn.onclick = () => this.start();
        this.pauseBtn.onclick = () => this.pause();
        this.resetBtn.onclick = () => this.reset();

        document.getElementById('work-duration').onchange = (e) => {
            this.workDuration = parseInt(e.target.value) * 60;
            if (this.mode === 'work' && !this.isRunning) {
                this.timeLeft = this.workDuration;
                this.updateDisplay();
            }
        };

        document.getElementById('break-duration').onchange = (e) => {
            this.breakDuration = parseInt(e.target.value) * 60;
            if (this.mode === 'break' && !this.isRunning) {
                this.timeLeft = this.breakDuration;
                this.updateDisplay();
            }
        };
    },

    loadState() {
        this.workDuration = 25 * 60;
        this.breakDuration = 5 * 60;
        this.timeLeft = this.workDuration;
        this.mode = 'work';
        this.isRunning = false;
        this.interval = null;
    },

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;

        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            if (this.timeLeft <= 0) {
                this.switchMode();
            }
        }, 1000);
    },

    pause() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        clearInterval(this.interval);
    },

    reset() {
        this.pause();
        this.mode = 'work';
        this.timeLeft = this.workDuration;
        this.updateDisplay();
    },

    switchMode() {
        clearInterval(this.interval);
        this.mode = this.mode === 'work' ? 'break' : 'work';
        this.timeLeft = this.mode === 'work' ? this.workDuration : this.breakDuration;
        this.label.textContent = this.mode === 'work' ? 'Session' : 'Break';

        // Notify
        if (Notification.permission === "granted") {
            new Notification(`Pomodoro: ${this.mode === 'work' ? 'Back to work!' : 'Time for a break!'}`);
        } else {
            alert(`Pomodoro: ${this.mode === 'work' ? 'Back to work!' : 'Time for a break!'}`);
        }

        this.updateDisplay();
        this.start(); // Auto-start next session
    },

    updateDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    cleanup() {
        clearInterval(this.interval);
    }
};
