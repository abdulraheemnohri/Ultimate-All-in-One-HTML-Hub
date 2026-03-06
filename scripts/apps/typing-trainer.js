/**
 * Typing Trainer App - Educational Tool
 */

const TypingTrainerApp = {
    init(containerId, params = {}) {
        this.containerId = containerId;
        this.quotes = [
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "The only way to do great work is to love what you do.",
            "Technology is best when it brings people together.",
            "Innovation distinguishes between a leader and a follower.",
            "The web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.",
            "HTML is the backbone of the web, providing structure to information."
        ];
        this.render();
        return () => this.cleanup();
    },

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="typing-trainer">
                <div class="tt-header">
                    <h2><i class="fas fa-keyboard"></i> Typing Trainer</h2>
                    <div class="tt-stats">
                        <div class="tt-stat">WPM: <span id="tt-wpm">0</span></div>
                        <div class="tt-stat">Accuracy: <span id="tt-acc">100%</span></div>
                    </div>
                </div>

                <div class="tt-display" id="tt-display">Click 'Start' to begin typing practice...</div>

                <textarea id="tt-input" class="tt-input" placeholder="Start typing here..." disabled></textarea>

                <div class="tt-controls">
                    <select id="tt-difficulty">
                        <option value="easy">Easy (Short)</option>
                        <option value="medium" selected>Medium (Quotes)</option>
                        <option value="hard">Hard (Technical)</option>
                    </select>
                    <button id="tt-start-btn" onclick="TypingTrainerApp.start()">Start Practice</button>
                </div>
            </div>
            <style>
                .typing-trainer { padding: 20px; display: flex; flex-direction: column; gap: 20px; color: var(--text-primary); }
                .tt-header { display: flex; justify-content: space-between; align-items: center; }
                .tt-stats { display: flex; gap: 20px; }
                .tt-stat { font-weight: bold; background: rgba(0,0,0,0.1); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; }

                .tt-display { background: var(--window-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); font-size: 1.3rem; line-height: 1.6; min-height: 120px; }
                .tt-display span.correct { color: #4caf50; }
                .tt-display span.incorrect { color: #ff5f56; background: rgba(255,0,0,0.1); }
                .tt-display span.current { border-bottom: 2px solid var(--accent-color); }

                .tt-input { width: 100%; height: 100px; padding: 15px; border-radius: 12px; border: 2px solid var(--border-color); background: rgba(0,0,0,0.05); color: var(--text-primary); font-size: 1.1rem; resize: none; }
                .tt-input:focus { border-color: var(--accent-color); outline: none; }

                .tt-controls { display: flex; gap: 15px; align-items: center; }
                .tt-controls select { padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                #tt-start-btn { padding: 10px 25px; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
            </style>
        `;
    },

    start() {
        const difficulty = document.getElementById('tt-difficulty').value;
        let text = "";

        if (difficulty === 'easy') {
            text = "The quick brown fox jumps over the lazy dog.";
        } else if (difficulty === 'hard') {
            text = "async function fetchData(url) { const response = await fetch(url); return await response.json(); }";
        } else {
            text = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        }

        this.targetText = text;
        this.startTime = null;
        this.errors = 0;
        this.charIndex = 0;

        const display = document.getElementById('tt-display');
        display.innerHTML = text.split('').map((char, i) => `<span id="tt-char-${i}">${char}</span>`).join('');

        const input = document.getElementById('tt-input');
        input.disabled = false;
        input.value = "";
        input.focus();

        document.getElementById('tt-start-btn').textContent = "Restart";

        input.oninput = (e) => this.handleInput(e);
    },

    handleInput(e) {
        if (!this.startTime) this.startTime = Date.now();

        const inputVal = e.target.value;
        const display = document.getElementById('tt-display');

        this.errors = 0;
        for (let i = 0; i < this.targetText.length; i++) {
            const charSpan = document.getElementById(`tt-char-${i}`);
            const typedChar = inputVal[i];

            if (typedChar == null) {
                charSpan.className = i === inputVal.length ? 'current' : '';
            } else if (typedChar === this.targetText[i]) {
                charSpan.className = 'correct';
            } else {
                charSpan.className = 'incorrect';
                this.errors++;
            }
        }

        // Calculate Stats
        const timeElapsed = (Date.now() - this.startTime) / 60000; // in minutes
        const wordsTyped = inputVal.length / 5;
        const wpm = Math.round(wordsTyped / (timeElapsed || 0.01));
        const accuracy = Math.round(((inputVal.length - this.errors) / (inputVal.length || 1)) * 100);

        document.getElementById('tt-wpm').textContent = wpm;
        document.getElementById('tt-acc').textContent = accuracy + '%';

        if (inputVal.length >= this.targetText.length) {
            this.finish();
        }
    },

    finish() {
        const input = document.getElementById('tt-input');
        input.disabled = true;
        Utils.showToast(`Practice Complete! WPM: ${document.getElementById('tt-wpm').textContent}`, 'success');
    },

    cleanup() {}
};
