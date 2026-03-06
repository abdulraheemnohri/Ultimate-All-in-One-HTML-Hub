/**
 * Kids Education App - Educational Tool
 */

const KidsEduApp = {
    init(containerId, params = {}) {
        this.containerId = containerId;
        this.render();
        return () => this.cleanup();
    },

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="kids-edu">
                <div class="ke-header">
                    <h2>🌈 Kids Learning Hub</h2>
                    <p>Fun games to learn shapes, colors, and math!</p>
                </div>

                <div class="ke-grid">
                    <div class="ke-card" onclick="KidsEduApp.startColors()">
                        <i class="fas fa-palette fa-3x" style="color: #ff5f56"></i>
                        <span>Color Fun</span>
                    </div>
                    <div class="ke-card" onclick="KidsEduApp.startShapes()">
                        <i class="fas fa-shapes fa-3x" style="color: #ffbd2e"></i>
                        <span>Shape Match</span>
                    </div>
                    <div class="ke-card" onclick="KidsEduApp.startMath()">
                        <i class="fas fa-plus-circle fa-3x" style="color: #27c93f"></i>
                        <span>Easy Math</span>
                    </div>
                </div>
                <div id="ke-game-area"></div>
            </div>
            <style>
                .kids-edu { padding: 20px; text-align: center; color: var(--text-primary); }
                .ke-header { margin-bottom: 30px; }
                .ke-grid { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
                .ke-card { background: var(--window-bg); padding: 30px; border-radius: 20px; border: 2px solid var(--border-color); cursor: pointer; transition: 0.3s; width: 150px; display: flex; flex-direction: column; gap: 15px; }
                .ke-card:hover { transform: scale(1.1); border-color: var(--accent-color); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                .ke-card span { font-weight: bold; font-size: 1.1rem; }

                #ke-game-area { min-height: 300px; padding: 20px; border-radius: 15px; background: rgba(0,0,0,0.02); }
                .ke-color-box { width: 100px; height: 100px; border-radius: 50%; margin: 20px auto; cursor: pointer; border: 5px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                .ke-options { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 20px; }
                .ke-opt-btn { padding: 15px 25px; border-radius: 30px; border: none; cursor: pointer; font-weight: bold; font-size: 1.2rem; transition: 0.2s; }
                .ke-opt-btn:hover { transform: translateY(-5px); }
            </style>
        `;
    },

    startColors() {
        const colors = [
            { name: 'Red', hex: '#ff5f56' },
            { name: 'Blue', hex: '#0078d4' },
            { name: 'Green', hex: '#27c93f' },
            { name: 'Yellow', hex: '#ffbd2e' },
            { name: 'Purple', hex: '#8e44ad' }
        ];
        const target = colors[Math.floor(Math.random() * colors.length)];
        const area = document.getElementById('ke-game-area');

        area.innerHTML = `
            <h3>What color is this?</h3>
            <div class="ke-color-box" style="background: ${target.hex}"></div>
            <div class="ke-options">
                ${colors.map(c => `<button class="ke-opt-btn" style="background: ${c.hex}; color: white;" onclick="KidsEduApp.checkColor('${c.name}', '${target.name}')">${c.name}</button>`).join('')}
            </div>
        `;
    },

    checkColor(selected, correct) {
        if (selected === correct) {
            Utils.showToast("🌟 Great Job! That's correct!", "success");
            setTimeout(() => this.startColors(), 1000);
        } else {
            Utils.showToast("Try again!", "warning");
        }
    },

    startShapes() {
        const shapes = [
            { name: 'Circle', icon: 'fa-circle' },
            { name: 'Square', icon: 'fa-square' },
            { name: 'Star', icon: 'fa-star' },
            { name: 'Heart', icon: 'fa-heart' }
        ];
        const target = shapes[Math.floor(Math.random() * shapes.length)];
        const area = document.getElementById('ke-game-area');

        area.innerHTML = `
            <h3>Find the ${target.name}!</h3>
            <div class="ke-options" style="font-size: 3rem;">
                ${shapes.map(s => `<i class="fas ${s.icon}" style="cursor:pointer; margin: 20px; transition: 0.2s;" onclick="KidsEduApp.checkShape('${s.name}', '${target.name}')"></i>`).join('')}
            </div>
        `;
    },

    checkShape(selected, correct) {
        if (selected === correct) {
            Utils.showToast("✨ Perfect! You found the " + correct, "success");
            setTimeout(() => this.startShapes(), 1000);
        } else {
            Utils.showToast("Oops! Not that one.", "warning");
        }
    },

    startMath() {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        const area = document.getElementById('ke-game-area');
        const correct = a + b;
        const options = [correct, correct + 1, Math.max(0, correct - 1), correct + 2].sort(() => Math.random() - 0.5);

        area.innerHTML = `
            <h3>What is ${a} + ${b}?</h3>
            <div class="ke-options">
                ${options.map(opt => `<button class="ke-opt-btn" style="background: var(--accent-color); color: white;" onclick="KidsEduApp.checkMath(${opt}, ${correct})">${opt}</button>`).join('')}
            </div>
        `;
    },

    checkMath(selected, correct) {
        if (selected === correct) {
            Utils.showToast("🚀 Correct! You are a math star!", "success");
            setTimeout(() => this.startMath(), 1000);
        } else {
            Utils.showToast("Try counting again!", "warning");
        }
    },

    cleanup() {}
};
