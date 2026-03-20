/**
 * Unit & Currency Converter App
 */

const ConverterApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="converter-app">
                <div class="converter-type">
                    <button onclick="ConverterApp.switchType('length')" class="active">Length</button>
                    <button onclick="ConverterApp.switchType('weight')">Weight</button>
                    <button onclick="ConverterApp.switchType('temperature')">Temp</button>
                </div>

                <div class="converter-inputs">
                    <div class="input-group">
                        <input type="number" id="unit-from-val" value="1" oninput="ConverterApp.convert()">
                        <select id="unit-from-type" onchange="ConverterApp.convert()"></select>
                    </div>
                    <div class="equals">=</div>
                    <div class="input-group">
                        <input type="number" id="unit-to-val" readonly>
                        <select id="unit-to-type" onchange="ConverterApp.convert()"></select>
                    </div>
                </div>
            </div>
            <style>
                .converter-app { padding: 20px; }
                .converter-type { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
                .converter-type button { padding: 5px 12px; border: none; background: transparent; color: var(--text-color); cursor: pointer; border-radius: 4px; }
                .converter-type button.active { background: var(--accent-color); color: white; }
                .converter-inputs { display: flex; flex-direction: column; gap: 15px; align-items: center; }
                .input-group { display: flex; width: 100%; gap: 10px; }
                .input-group input { flex-grow: 1; padding: 10px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .input-group select { padding: 10px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .equals { font-size: 1.5rem; font-weight: bold; }
            </style>
        `;

        this.typeButtons = this.container.querySelectorAll('.converter-type button');
        this.fromVal = document.getElementById('unit-from-val');
        this.toVal = document.getElementById('unit-to-val');
        this.fromType = document.getElementById('unit-from-type');
        this.toType = document.getElementById('unit-to-type');

        this.units = {
            length: { m: 1, km: 0.001, cm: 100, mm: 1000, inch: 39.3701, ft: 3.28084, mile: 0.000621371 },
            weight: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274 },
            temperature: { c: 'c', f: 'f', k: 'k' }
        };

        this.currentType = 'length';
        this.updateSelectors();
    },

    switchType(type) {
        this.currentType = type;
        this.typeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase().includes(type.substring(0, 3)));
        });
        this.updateSelectors();
    },

    updateSelectors() {
        const options = Object.keys(this.units[this.currentType]);
        this.fromType.innerHTML = options.map(o => `<option value="${o}">${o.toUpperCase()}</option>`).join('');
        this.toType.innerHTML = options.map(o => `<option value="${o}">${o.toUpperCase()}</option>`).join('');

        if (options.length > 1) {
            this.toType.selectedIndex = 1;
        }
        this.convert();
    },

    convert() {
        const val = parseFloat(this.fromVal.value);
        if (isNaN(val)) {
            this.toVal.value = '';
            return;
        }

        const from = this.fromType.value;
        const to = this.toType.value;

        if (this.currentType === 'temperature') {
            this.toVal.value = this.convertTemp(val, from, to).toFixed(2);
        } else {
            const base = val / this.units[this.currentType][from];
            const result = base * this.units[this.currentType][to];
            this.toVal.value = result.toLocaleString(undefined, { maximumFractionDigits: 5 });
        }
    },

    convertTemp(val, from, to) {
        let celsius;
        if (from === 'c') celsius = val;
        else if (from === 'f') celsius = (val - 32) * 5/9;
        else if (from === 'k') celsius = val - 273.15;

        if (to === 'c') return celsius;
        else if (to === 'f') return (celsius * 9/5) + 32;
        else if (to === 'k') return celsius + 273.15;
    }
};
