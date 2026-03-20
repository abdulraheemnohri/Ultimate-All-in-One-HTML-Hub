/**
 * Daily Planner App
 */

const PlannerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.load();
        this.render();
        return () => {};
    },

    load() {
        this.schedule = Storage.load('planner_schedule') || {};
        this.date = new Date().toISOString().split('T')[0];
    },

    save() {
        Storage.save('planner_schedule', this.schedule);
    },

    render() {
        this.container.innerHTML = `
            <div class="planner-app">
                <div class="planner-header">
                    <h3>Schedule for ${this.date}</h3>
                </div>
                <div class="planner-grid">
                    ${this.renderHours()}
                </div>
            </div>
            <style>
                .planner-app { padding: 15px; }
                .planner-header { margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
                .planner-grid { display: flex; flex-direction: column; gap: 5px; }
                .hour-row { display: flex; gap: 10px; align-items: center; }
                .hour-label { width: 70px; font-size: 0.8rem; opacity: 0.7; }
                .hour-input { flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); font-size: 0.9rem; }
            </style>
        `;

        this.container.querySelectorAll('.hour-input').forEach(input => {
            input.onchange = (e) => {
                const hour = e.target.getAttribute('data-hour');
                if (!this.schedule[this.date]) this.schedule[this.date] = {};
                this.schedule[this.date][hour] = e.target.value;
                this.save();
            };
        });
    },

    renderHours() {
        let html = '';
        const dayData = this.schedule[this.date] || {};
        for (let i = 6; i <= 22; i++) {
            const label = i <= 12 ? `${i}:00 AM` : `${i - 12}:00 PM`;
            const value = dayData[i] || '';
            html += `
                <div class="hour-row">
                    <div class="hour-label">${label}</div>
                    <input type="text" class="hour-input" data-hour="${i}" value="${value}" placeholder="Plan something...">
                </div>
            `;
        }
        return html;
    }
};
