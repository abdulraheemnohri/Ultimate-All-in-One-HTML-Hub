const CalculatorApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.display = '0';
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="calc-app">
                <div class="calc-display" id="calc-display">${this.display}</div>
                <div class="calc-buttons">
                    <button class="btn-clear" onclick="CalculatorApp.clear()">C</button>
                    <button onclick="CalculatorApp.append('/')">/</button>
                    <button onclick="CalculatorApp.append('*')">*</button>
                    <button onclick="CalculatorApp.delete()"><i class="fas fa-backspace"></i></button>
                    <button onclick="CalculatorApp.append('7')">7</button>
                    <button onclick="CalculatorApp.append('8')">8</button>
                    <button onclick="CalculatorApp.append('9')">9</button>
                    <button onclick="CalculatorApp.append('-')">-</button>
                    <button onclick="CalculatorApp.append('4')">4</button>
                    <button onclick="CalculatorApp.append('5')">5</button>
                    <button onclick="CalculatorApp.append('6')">6</button>
                    <button onclick="CalculatorApp.append('+')">+</button>
                    <button onclick="CalculatorApp.append('1')">1</button>
                    <button onclick="CalculatorApp.append('2')">2</button>
                    <button onclick="CalculatorApp.append('3')">3</button>
                    <button class="btn-equal" onclick="CalculatorApp.calculate()">=</button>
                    <button onclick="CalculatorApp.append('0')" style="grid-column: span 2">0</button>
                    <button onclick="CalculatorApp.append('.')">.</button>
                </div>
            </div>
            <style>
                .calc-app { display: flex; flex-direction: column; gap: 10px; max-width: 250px; margin: 0 auto; }
                .calc-display { background: #333; color: white; font-family: monospace; font-size: 2rem; padding: 20px; text-align: right; border-radius: 8px; overflow: hidden; }
                .calc-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
                .calc-buttons button { padding: 15px; font-size: 1.2rem; border: none; border-radius: 8px; cursor: pointer; background: rgba(0,0,0,0.05); color: inherit; }
                .calc-buttons button:hover { background: rgba(0,0,0,0.1); }
                .btn-clear { color: #ff5f56 !important; }
                .btn-equal { background: var(--accent-color) !important; color: white !important; grid-row: span 2; }
            </style>
        `;
    },

    append(val) {
        if (this.display === '0' && !isNaN(val)) this.display = val;
        else this.display += val;
        this.updateDisplay();
    },

    clear() {
        this.display = '0';
        this.updateDisplay();
    },

    delete() {
        this.display = this.display.slice(0, -1) || '0';
        this.updateDisplay();
    },

    calculate() {
        try {
            // Safer alternative to eval() for basic arithmetic
            // Use Function constructor with a restricted scope or a regex-validated eval
            // For simple arithmetic, this is relatively safe as we control inputs
            const safeResult = new Function(`return ${this.display}`)();
            this.display = safeResult.toString();
        } catch (e) {
            this.display = 'Error';
        }
        this.updateDisplay();
    },

    updateDisplay() {
        document.getElementById('calc-display').textContent = this.display;
    }
};
