/**
 * Adult Education App - Professional Skills & Advanced Math
 */

const AdultEduApp = {
    init(containerId, params = {}) {
        this.containerId = containerId;
        this.render();
        return () => this.cleanup();
    },

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="adult-edu">
                <div class="ae-header">
                    <h2>🎓 Professional Hub</h2>
                    <p>Advance your career with skills training and advanced logic.</p>
                </div>

                <div class="ae-grid">
                    <div class="ae-card" onclick="AdultEduApp.showSkillTracker()">
                        <i class="fas fa-chart-line fa-3x" style="color: #0078d4"></i>
                        <span>Skill Tracker</span>
                    </div>
                    <div class="ae-card" onclick="AdultEduApp.showAdvMath()">
                        <i class="fas fa-square-root-alt fa-3x" style="color: #8e44ad"></i>
                        <span>Adv. Logic</span>
                    </div>
                    <div class="ae-card" onclick="AdultEduApp.showLangLab()">
                        <i class="fas fa-language fa-3x" style="color: #27c93f"></i>
                        <span>Language Lab</span>
                    </div>
                </div>
                <div id="ae-content-area"></div>
            </div>
            <style>
                .adult-edu { padding: 20px; color: var(--text-primary); }
                .ae-header { text-align: center; margin-bottom: 30px; }
                .ae-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .ae-card { background: var(--window-bg); padding: 25px; border-radius: 15px; border: 1px solid var(--border-color); cursor: pointer; transition: 0.3s; text-align: center; display: flex; flex-direction: column; gap: 15px; }
                .ae-card:hover { transform: translateY(-5px); border-color: var(--accent-color); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
                .ae-card span { font-weight: bold; }

                #ae-content-area { background: rgba(0,0,0,0.03); border-radius: 15px; padding: 25px; min-height: 350px; }
                .skill-row { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
                .skill-bar { flex-grow: 1; height: 10px; background: rgba(0,0,0,0.1); border-radius: 5px; overflow: hidden; }
                .skill-progress { height: 100%; background: var(--accent-color); transition: 1s; width: 0; }

                .ae-math-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .ae-btn { padding: 12px; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; }
            </style>
        `;
    },

    showSkillTracker() {
        const skills = [
            { name: 'Data Analysis', level: 65 },
            { name: 'Web Architecture', level: 80 },
            { name: 'Strategic Planning', level: 45 },
            { name: 'Digital Security', level: 30 }
        ];
        const area = document.getElementById('ae-content-area');
        area.innerHTML = `
            <h3>Your Professional Progress</h3>
            <div style="margin-top: 20px;">
                ${skills.map(s => `
                    <div class="skill-item">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span>${s.name}</span>
                            <span>${s.level}%</span>
                        </div>
                        <div class="skill-row">
                            <div class="skill-bar"><div class="skill-progress" id="skill-${s.name.replace(/ /g, '')}" style="width: 0%"></div></div>
                            <button class="ae-btn" style="padding: 5px 10px; font-size: 0.8rem;" onclick="AdultEduApp.trainSkill('${s.name}')">Train</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        setTimeout(() => {
            skills.forEach(s => {
                document.getElementById(`skill-${s.name.replace(/ /g, '')}`).style.width = s.level + '%';
            });
        }, 100);
    },

    trainSkill(name) {
        Utils.showToast(`Training ${name}... Check back later!`, 'info');
    },

    showAdvMath() {
        const area = document.getElementById('ae-content-area');
        area.innerHTML = `
            <h3>Logic & Analysis</h3>
            <p style="margin-bottom: 20px; opacity: 0.7;">Solve complex equations to boost your cognitive score.</p>
            <div class="ae-math-grid">
                <div style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px;">
                    <h4>Solve for x:</h4>
                    <p style="font-size: 1.5rem; margin: 15px 0;">2x + 15 = 45</p>
                    <input type="number" id="math-ans" style="width:100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); margin-bottom: 10px;">
                    <button class="ae-btn" style="width: 100%;" onclick="AdultEduApp.checkAdvMath(15)">Submit Answer</button>
                </div>
                <div style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px;">
                    <h4>Sequence Pattern:</h4>
                    <p style="font-size: 1.5rem; margin: 15px 0;">2, 6, 12, 20, ?</p>
                    <input type="number" id="seq-ans" style="width:100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); margin-bottom: 10px;">
                    <button class="ae-btn" style="width: 100%;" onclick="AdultEduApp.checkAdvMath(30, 'seq')">Submit Answer</button>
                </div>
            </div>
        `;
    },

    checkAdvMath(correct, type = 'math') {
        const id = type === 'math' ? 'math-ans' : 'seq-ans';
        const val = parseInt(document.getElementById(id).value);
        if (val === correct) {
            Utils.showToast("Excellent Analytical Logic!", "success");
        } else {
            Utils.showToast("Incorrect. Re-evaluate your steps.", "danger");
        }
    },

    showLangLab() {
        const area = document.getElementById('ae-content-area');
        area.innerHTML = `
            <h3>Language Learning Lab</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px; margin-top: 20px;">
                <div class="ae-card" style="padding: 15px; font-size: 0.9rem;" onclick="AdultEduApp.startLang('Spanish')">Spanish</div>
                <div class="ae-card" style="padding: 15px; font-size: 0.9rem;" onclick="AdultEduApp.startLang('French')">French</div>
                <div class="ae-card" style="padding: 15px; font-size: 0.9rem;" onclick="AdultEduApp.startLang('German')">German</div>
                <div class="ae-card" style="padding: 15px; font-size: 0.9rem;" onclick="AdultEduApp.startLang('Japanese')">Japanese</div>
            </div>
        `;
    },

    startLang(name) {
        Utils.showToast(`Loading ${name} modules...`, 'info');
    },

    cleanup() {}
};
