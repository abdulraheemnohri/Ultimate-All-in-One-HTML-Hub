/**
 * Habit Tracker App
 */

const HabitTrackerApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.loadHabits();
        this.render();
        return () => {};
    },

    loadHabits() {
        this.habits = Storage.load('habits') || [];
    },

    saveHabits() {
        Storage.save('habits', this.habits);
    },

    render() {
        this.container.innerHTML = `
            <div class="habit-app">
                <header>
                    <h3>My Habits</h3>
                    <button id="add-habit-btn"><i class="fas fa-plus"></i> Add Habit</button>
                </header>
                <div id="habit-list"></div>
            </div>
            <style>
                .habit-app { padding: 15px; }
                .habit-app header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .habit-app button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .habit-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 15px; }
                .habit-info { flex-grow: 1; }
                .habit-info h4 { margin: 0; font-size: 1.1rem; }
                .habit-info p { margin: 2px 0 0; font-size: 0.85rem; opacity: 0.7; }
                .habit-stats { display: flex; gap: 5px; }
                .streak-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border-color); cursor: pointer; transition: 0.2s; }
                .streak-circle.active { background: var(--accent-color); border-color: var(--accent-color); }
                .habit-actions { opacity: 0; transition: 0.2s; }
                .habit-item:hover .habit-actions { opacity: 1; }
                .habit-actions i { cursor: pointer; color: #ff5f56; }
            </style>
        `;

        this.habitList = document.getElementById('habit-list');
        document.getElementById('add-habit-btn').onclick = () => this.addNewHabit();

        this.renderHabitList();
    },

    renderHabitList() {
        this.habitList.innerHTML = '';
        if (this.habits.length === 0) {
            this.habitList.innerHTML = '<p style="text-align:center; opacity: 0.5; margin-top: 50px;">No habits yet. Start one today!</p>';
            return;
        }

        this.habits.forEach((habit, index) => {
            const item = document.createElement('div');
            item.className = 'habit-item';

            const today = new Date().toISOString().split('T')[0];
            const isDoneToday = habit.history && habit.history.includes(today);

            item.innerHTML = `
                <div class="habit-info">
                    <h4>${habit.name}</h4>
                    <p>Streak: ${this.calculateStreak(habit)} days</p>
                </div>
                <div class="habit-stats">
                    ${this.renderHistory(habit)}
                </div>
                <button class="streak-circle ${isDoneToday ? 'active' : ''}" onclick="HabitTrackerApp.toggleHabit(${index})"></button>
                <div class="habit-actions">
                    <i class="fas fa-trash" onclick="HabitTrackerApp.deleteHabit(${index})"></i>
                </div>
            `;
            this.habitList.appendChild(item);
        });
    },

    renderHistory(habit) {
        // Show last 7 days mini-circles
        let html = '';
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const active = habit.history && habit.history.includes(dateStr);
            html += `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${active ? 'var(--accent-color)' : 'var(--border-color)'}; margin: 0 1px;"></span>`;
        }
        return html;
    },

    calculateStreak(habit) {
        if (!habit.history || habit.history.length === 0) return 0;
        const sortedHistory = [...habit.history].sort((a, b) => new Date(b) - new Date(a));
        let streak = 0;
        let currentDate = new Date();

        // If not done today, check if done yesterday to maintain streak
        const todayStr = currentDate.toISOString().split('T')[0];
        if (!sortedHistory.includes(todayStr)) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        for (let i = 0; i < sortedHistory.length; i++) {
            const histDateStr = sortedHistory[i];
            const checkDateStr = currentDate.toISOString().split('T')[0];

            if (histDateStr === checkDateStr) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    },

    addNewHabit() {
        const name = prompt('What is your new habit?');
        if (name && name.trim()) {
            this.habits.push({
                name: name.trim(),
                history: []
            });
            this.saveHabits();
            this.renderHabitList();
        }
    },

    toggleHabit(index) {
        const today = new Date().toISOString().split('T')[0];
        const habit = this.habits[index];
        if (!habit.history) habit.history = [];

        const dateIndex = habit.history.indexOf(today);
        if (dateIndex === -1) {
            habit.history.push(today);
        } else {
            habit.history.splice(dateIndex, 1);
        }

        this.saveHabits();
        this.renderHabitList();
    },

    deleteHabit(index) {
        if (confirm('Delete this habit?')) {
            this.habits.splice(index, 1);
            this.saveHabits();
            this.renderHabitList();
        }
    }
};
