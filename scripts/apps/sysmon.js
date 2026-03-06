/**
 * System Monitor App
 */

const SysMonApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.startMonitoring();
        return () => clearInterval(this.interval);
    },

    render() {
        this.container.innerHTML = `
            <div class="sysmon-app">
                <div class="monitor-grid">
                    <div class="monitor-card">
                        <h3>CPU Usage</h3>
                        <div class="gauge-container">
                            <canvas id="cpu-gauge"></canvas>
                            <div class="gauge-value" id="cpu-val">0%</div>
                        </div>
                    </div>
                    <div class="monitor-card">
                        <h3>RAM Usage</h3>
                        <div class="gauge-container">
                            <canvas id="ram-gauge"></canvas>
                            <div class="gauge-value" id="ram-val">0%</div>
                        </div>
                    </div>
                </div>
                <div class="storage-info monitor-card">
                    <h3>Storage Usage</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" id="storage-fill" style="width: 0%"></div>
                    </div>
                    <p id="storage-text">Calculating...</p>
                </div>
            </div>
            <style>
                .sysmon-app { padding: 15px; }
                .monitor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                .monitor-card { background: rgba(0,0,0,0.1); padding: 15px; border-radius: 10px; text-align: center; }
                .monitor-card h3 { font-size: 0.9rem; margin-bottom: 10px; opacity: 0.8; }
                .gauge-container { position: relative; height: 120px; }
                .gauge-value { position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); font-size: 1.2rem; font-weight: bold; }
                .progress-bar { height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; margin-top: 10px; }
                .progress-fill { height: 100%; background: var(--accent-color); transition: width 0.5s; }
                #storage-text { font-size: 0.8rem; margin-top: 5px; opacity: 0.7; }
            </style>
        `;

        this.cpuChart = this.initGauge('cpu-gauge', '#ff5f56');
        this.ramChart = this.initGauge('ram-gauge', '#27c93f');
    },

    initGauge(id, color) {
        return new Chart(document.getElementById(id), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 100],
                    backgroundColor: [color, 'rgba(0,0,0,0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '80%',
                circumference: 180,
                rotation: -90,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    },

    startMonitoring() {
        this.updateStats();
        this.interval = setInterval(() => this.updateStats(), 2000);
    },

    updateStats() {
        // Mock dynamic values
        const cpu = Math.floor(Math.random() * 40) + 10;
        const ram = Math.floor(Math.random() * 30) + 40;

        this.cpuChart.data.datasets[0].data = [cpu, 100 - cpu];
        this.cpuChart.update();
        document.getElementById('cpu-val').textContent = `${cpu}%`;

        this.ramChart.data.datasets[0].data = [ram, 100 - ram];
        this.ramChart.update();
        document.getElementById('ram-val').textContent = `${ram}%`;

        // Real LocalStorage storage calc
        const used = (JSON.stringify(localStorage).length / 1024).toFixed(2);
        const total = 5120; // 5MB typical limit
        const percent = (used / total * 100).toFixed(1);

        document.getElementById('storage-fill').style.width = `${percent}%`;
        document.getElementById('storage-text').textContent = `${used} KB / ${total} KB (${percent}%)`;
    }
};
