/**
 * Password Generator App
 */

const PassGenApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.generate();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="passgen-app">
                <div class="pass-display">
                    <input type="text" id="pass-result" readonly>
                    <button id="copy-pass-btn"><i class="fas fa-copy"></i></button>
                </div>

                <div class="pass-settings">
                    <div class="setting-item">
                        <label>Length: <span id="pass-length-val">16</span></label>
                        <input type="range" id="pass-length" min="4" max="50" value="16">
                    </div>

                    <div class="setting-grid">
                        <label><input type="checkbox" id="pass-upper" checked> Uppercase</label>
                        <label><input type="checkbox" id="pass-lower" checked> Lowercase</label>
                        <label><input type="checkbox" id="pass-numbers" checked> Numbers</label>
                        <label><input type="checkbox" id="pass-symbols" checked> Symbols</label>
                    </div>
                </div>

                <button id="gen-pass-btn" class="main-btn">Generate Password</button>
            </div>
            <style>
                .passgen-app { padding: 20px; text-align: center; }
                .pass-display { display: flex; gap: 10px; margin-bottom: 25px; }
                #pass-result { flex-grow: 1; padding: 12px; font-size: 1.2rem; font-family: monospace; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); text-align: center; }
                #copy-pass-btn { padding: 12px; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; }
                .pass-settings { margin-bottom: 25px; text-align: left; }
                .setting-item { margin-bottom: 15px; }
                .setting-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .setting-grid label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; }
                .main-btn { width: 100%; padding: 12px; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
            </style>
        `;

        this.result = document.getElementById('pass-result');
        this.lengthSlider = document.getElementById('pass-length');
        this.lengthVal = document.getElementById('pass-length-val');

        this.lengthSlider.oninput = () => this.lengthVal.textContent = this.lengthSlider.value;

        document.getElementById('gen-pass-btn').onclick = () => this.generate();
        document.getElementById('copy-pass-btn').onclick = () => {
            this.result.select();
            document.execCommand('copy');
            alert('Password copied!');
        };
    },

    generate() {
        const length = parseInt(this.lengthSlider.value);
        const upper = document.getElementById('pass-upper').checked;
        const lower = document.getElementById('pass-lower').checked;
        const numbers = document.getElementById('pass-numbers').checked;
        const symbols = document.getElementById('pass-symbols').checked;

        const charSets = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };

        let chars = '';
        if (upper) chars += charSets.upper;
        if (lower) chars += charSets.lower;
        if (numbers) chars += charSets.numbers;
        if (symbols) chars += charSets.symbols;

        if (!chars) {
            this.result.value = 'Select at least one!';
            return;
        }

        let pass = '';
        for (let i = 0; i < length; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        this.result.value = pass;
    }
};
