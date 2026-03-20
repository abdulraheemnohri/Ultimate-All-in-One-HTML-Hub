/**
 * Hangman Game
 */

const HangmanApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.words = ["JAVASCRIPT", "HTML", "CSS", "BROWSER", "SANDBOX", "DEVELOPER", "ULTIMATE", "DASHBOARD"];
        this.reset();
        this.render();
        return () => {};
    },

    reset() {
        this.word = this.words[Math.floor(Math.random() * this.words.length)];
        this.guessed = [];
        this.mistakes = 0;
        this.maxMistakes = 6;
    },

    render() {
        this.container.innerHTML = `
            <div class="hangman-app">
                <div class="hangman-viz">
                    Mistakes: ${this.mistakes} / ${this.maxMistakes}
                </div>
                <div class="hangman-word" id="hangman-word"></div>
                <div class="hangman-kb" id="hangman-kb"></div>
                <button onclick="HangmanApp.restart()" style="margin-top:20px">New Game</button>
            </div>
            <style>
                .hangman-app { padding: 20px; text-align: center; }
                .hangman-viz { font-size: 1.2rem; margin-bottom: 20px; font-weight: bold; color: #f44336; }
                .hangman-word { font-size: 2.5rem; letter-spacing: 10px; margin-bottom: 30px; font-family: monospace; }
                .hangman-kb { display: grid; grid-template-columns: repeat(9, 1fr); gap: 5px; max-width: 400px; margin: 0 auto; }
                .hangman-kb button { padding: 10px 5px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); cursor: pointer; border-radius: 4px; }
                .hangman-kb button:disabled { opacity: 0.3; cursor: default; }
            </style>
        `;
        this.updateDisplay();
        this.createKeyboard();
    },

    updateDisplay() {
        const display = this.word.split('').map(letter => this.guessed.includes(letter) ? letter : '_').join('');
        document.getElementById('hangman-word').textContent = display;

        if (display === this.word) {
            alert('You Won!');
            this.disableAll();
        } else if (this.mistakes >= this.maxMistakes) {
            alert('Game Over! The word was: ' + this.word);
            this.disableAll();
        }
    },

    createKeyboard() {
        const kb = document.getElementById('hangman-kb');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        alphabet.split('').forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.onclick = () => this.guess(letter, btn);
            kb.appendChild(btn);
        });
    },

    guess(letter, btn) {
        btn.disabled = true;
        this.guessed.push(letter);
        if (!this.word.includes(letter)) {
            this.mistakes++;
            this.container.querySelector('.hangman-viz').textContent = `Mistakes: ${this.mistakes} / ${this.maxMistakes}`;
        }
        this.updateDisplay();
    },

    disableAll() {
        this.container.querySelectorAll('.hangman-kb button').forEach(b => b.disabled = true);
    },

    restart() {
        this.reset();
        this.render();
    }
};
