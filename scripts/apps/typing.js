/**
 * Typing Speed Trainer App
 */

const TypingApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.quotes = [
            "The quick brown fox jumps over the lazy dog.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "Life is what happens when you're busy making other plans.",
            "To be or not to be, that is the question.",
            "All that glitters is not gold."
        ];
        this.reset();
        this.render();
        return () => clearInterval(this.timer);
    },

    reset() {
        this.quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        this.startTime = null;
        this.wpm = 0;
        this.accuracy = 100;
        this.finished = false;
        clearInterval(this.timer);
    },

    render() {
        this.container.innerHTML = `
            <div class="typing-app">
                <div class="typing-stats">
                    <span>WPM: <b id="typing-wpm">0</b></span>
                    <span>Accuracy: <b id="typing-acc">100%</b></span>
                </div>
                <div class="typing-quote" id="typing-quote"></div>
                <textarea id="typing-input" placeholder="Start typing here..."></textarea>
                <button onclick="TypingApp.restart()">Restart</button>
            </div>
            <style>
                .typing-app { padding: 20px; text-align: center; }
                .typing-stats { display: flex; justify-content: space-around; margin-bottom: 20px; font-size: 1.2rem; }
                .typing-quote {
                    background: var(--bg-color);
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 1.3rem;
                    line-height: 1.6;
                    text-align: left;
                    border: 1px solid var(--border-color);
                }
                .typing-quote span.correct { color: #4caf50; }
                .typing-quote span.incorrect { color: #f44336; background: rgba(244, 67, 54, 0.1); }
                .typing-quote span.current { border-bottom: 2px solid var(--accent-color); }
                #typing-input {
                    width: 100%; height: 80px; padding: 10px; border-radius: 8px;
                    border: 1px solid var(--border-color); background: var(--bg-color);
                    color: var(--text-color); font-size: 1.1rem; margin-bottom: 15px; resize: none;
                }
                .typing-app button { padding: 10px 20px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
        `;

        this.quoteEl = document.getElementById('typing-quote');
        this.inputEl = document.getElementById('typing-input');
        this.wpmEl = document.getElementById('typing-wpm');
        this.accEl = document.getElementById('typing-acc');

        this.updateQuoteDisplay("");

        this.inputEl.oninput = (e) => this.handleInput(e.target.value);
    },

    updateQuoteDisplay(typed) {
        let html = "";
        let errors = 0;
        for (let i = 0; i < this.quote.length; i++) {
            let char = this.quote[i];
            let typedChar = typed[i];

            if (typedChar == null) {
                html += `<span class="${i === typed.length ? 'current' : ''}">${char}</span>`;
            } else if (typedChar === char) {
                html += `<span class="correct">${char}</span>`;
            } else {
                html += `<span class="incorrect">${char}</span>`;
                errors++;
            }
        }
        this.quoteEl.innerHTML = html;
        this.accuracy = Math.max(0, Math.round(((typed.length - errors) / Math.max(1, typed.length)) * 100));
        this.accEl.textContent = this.accuracy + "%";
    },

    handleInput(typed) {
        if (!this.startTime && typed.length > 0) {
            this.startTime = Date.now();
            this.timer = setInterval(() => this.updateWPM(), 1000);
        }

        this.updateQuoteDisplay(typed);

        if (typed.length >= this.quote.length && !this.finished) {
            this.finished = true;
            clearInterval(this.timer);
            this.updateWPM();
            this.inputEl.disabled = true;
            alert(`Finished! WPM: ${this.wpm}, Accuracy: ${this.accuracy}%`);
        }
    },

    updateWPM() {
        if (!this.startTime) return;
        const timePassed = (Date.now() - this.startTime) / 60000; // in minutes
        const words = this.inputEl.value.length / 5;
        this.wpm = Math.round(words / timePassed);
        this.wpmEl.textContent = this.wpm;
    },

    restart() {
        this.reset();
        this.render();
    }
};
