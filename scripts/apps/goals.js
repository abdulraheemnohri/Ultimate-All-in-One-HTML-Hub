/**
 * Goal Tracker App
 */

const GoalTrackerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.load();
        this.render();
        return () => {};
    },

    load() {
        this.goals = Storage.load('goals') || [];
    },

    save() {
        Storage.save('goals', this.goals);
    },

    render() {
        this.container.innerHTML = `
            <div class="goals-app">
                <div class="add-goal">
                    <input type="text" id="goal-input" placeholder="Set a new goal...">
                    <button onclick="GoalTrackerApp.addGoal()">Track</button>
                </div>
                <div id="goals-list"></div>
            </div>
            <style>
                .goals-app { padding: 15px; }
                .add-goal { display: flex; gap: 10px; margin-bottom: 20px; }
                .add-goal input { flex-grow: 1; padding: 10px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .add-goal button { padding: 10px 20px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .goal-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 10px; }
                .goal-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .goal-info h4 { margin: 0; }
                .goal-progress-bar { height: 10px; background: rgba(0,0,0,0.1); border-radius: 5px; overflow: hidden; position: relative; cursor: pointer; }
                .goal-progress-fill { height: 100%; background: var(--accent-color); transition: 0.3s; }
                .goal-actions { text-align: right; margin-top: 10px; }
                .goal-actions i { cursor: pointer; color: #ff5f56; opacity: 0.7; }
            </style>
        `;
        this.renderList();
    },

    renderList() {
        const list = document.getElementById('goals-list');
        list.innerHTML = '';
        this.goals.forEach((goal, index) => {
            const el = document.createElement('div');
            el.className = 'goal-item';
            el.innerHTML = `
                <div class="goal-info">
                    <h4>${goal.name}</h4>
                    <span>${goal.progress}%</span>
                </div>
                <div class="goal-progress-bar" onclick="GoalTrackerApp.updateProgress(${index}, event)">
                    <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="goal-actions">
                    <i class="fas fa-trash" onclick="GoalTrackerApp.deleteGoal(${index})"></i>
                </div>
            `;
            list.appendChild(el);
        });
    },

    addGoal() {
        const input = document.getElementById('goal-input');
        const name = input.value.trim();
        if (name) {
            this.goals.push({ name, progress: 0 });
            input.value = '';
            this.save();
            this.renderList();
        }
    },

    updateProgress(index, event) {
        const bar = event.currentTarget;
        const rect = bar.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percent = Math.round((x / rect.width) * 100);
        this.goals[index].progress = Math.max(0, Math.min(100, percent));
        this.save();
        this.renderList();
    },

    deleteGoal(index) {
        if(confirm('Delete goal?')) {
            this.goals.splice(index, 1);
            this.save();
            this.renderList();
        }
    }
};
