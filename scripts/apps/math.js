/**
 * Math Practice App
 */

const MathApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.score = 0;
        this.total = 0;
        this.generateProblem();
        this.render();
        return () => {};
    },

    generateProblem() {
        const ops = ['+', '-', '*'];
        this.op = ops[Math.floor(Math.random() * ops.length)];
        this.num1 = Math.floor(Math.random() * 20) + 1;
        this.num2 = Math.floor(Math.random() * (this.op === '*' ? 10 : 20)) + 1;

        switch(this.op) {
            case '+': this.answer = this.num1 + this.num2; break;
            case '-': this.answer = this.num1 - this.num2; break;
            case '*': this.answer = this.num1 * this.num2; break;
        }
    },

    render() {
        this.container.innerHTML = `
            <div class="math-app">
                <div class="math-score">Score: <b id="math-score">${this.score}/${this.total}</b></div>
                <div class="math-problem">
                    <span id="math-q">${this.num1} ${this.op} ${this.num2}</span> =
                    <input type="number" id="math-ans" autofocus>
                </div>
                <div id="math-feedback"></div>
            </div>
            <style>
                .math-app { padding: 30px; text-align: center; }
                .math-score { margin-bottom: 20px; font-size: 1.2rem; opacity: 0.8; }
                .math-problem { font-size: 2.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 15px; }
                .math-problem input { width: 120px; padding: 10px; border-radius: 8px; border: 2px solid var(--accent-color); background: var(--bg-color); color: var(--text-color); font-size: 2rem; text-align: center; }
                #math-feedback { margin-top: 20px; font-size: 1.2rem; font-weight: bold; height: 1.5em; }
                .correct { color: #4caf50; }
                .incorrect { color: #f44336; }
            </style>
        `;

        this.input = document.getElementById('math-ans');
        this.feedback = document.getElementById('math-feedback');
        this.scoreEl = document.getElementById('math-score');

        this.input.onkeyup = (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        };
    },

    checkAnswer() {
        const userAns = parseInt(this.input.value);
        this.total++;
        if (userAns === this.answer) {
            this.score++;
            this.feedback.innerHTML = '<span class="correct">Correct!</span>';
        } else {
            this.feedback.innerHTML = `<span class="incorrect">Wrong! It was ${this.answer}</span>`;
        }

        this.scoreEl.textContent = `${this.score}/${this.total}`;
        this.input.value = '';
        this.generateProblem();
        document.getElementById('math-q').textContent = `${this.num1} ${this.op} ${this.num2}`;
    }
};
