/**
 * Analytics Dashboard App
 */

const AnalyticsApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.renderCharts();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="analytics-app">
                <div class="chart-container">
                    <h3>Finances: Income vs Expenses</h3>
                    <canvas id="finance-chart"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Habit Progress (Last 7 Days)</h3>
                    <canvas id="habit-chart"></canvas>
                </div>
            </div>
            <style>
                .analytics-app { padding: 20px; display: grid; grid-template-columns: 1fr; gap: 30px; }
                .chart-container { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 15px; }
                .chart-container h3 { margin-bottom: 15px; font-size: 1rem; opacity: 0.8; }
                canvas { width: 100% !important; height: 250px !important; }
            </style>
        `;
    },

    renderCharts() {
        // Finance Data
        const finance = Storage.load('finance') || { income: 5000, expenses: [] };
        const totalExpenses = finance.expenses.reduce((sum, e) => sum + e.amount, 0);

        new Chart(document.getElementById('finance-chart'), {
            type: 'pie',
            data: {
                labels: ['Income Left', 'Expenses'],
                datasets: [{
                    data: [finance.income - totalExpenses, totalExpenses],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Habit Data
        const habits = Storage.load('habits') || [];
        const last7Days = [];
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
        }

        const habitCounts = last7Days.map(date => {
            return habits.filter(h => h.history && h.history.includes(date)).length;
        });

        new Chart(document.getElementById('habit-chart'), {
            type: 'bar',
            data: {
                labels: last7Days.map(d => d.slice(5)), // MM-DD
                datasets: [{
                    label: 'Habits Completed',
                    data: habitCounts,
                    backgroundColor: '#0078d4'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }
};
