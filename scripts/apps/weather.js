/**
 * Weather App (Mock)
 */

const WeatherApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        const city = Storage.load('weather-city') || 'London';
        this.container.innerHTML = `
            <div class="weather-app">
                <div class="weather-header">
                    <input type="text" id="weather-city-input" value="${city}" placeholder="Enter city...">
                    <button onclick="WeatherApp.refresh()"><i class="fas fa-search"></i></button>
                </div>
                <div class="weather-main">
                    <div class="weather-icon">
                        <i class="fas fa-cloud-sun"></i>
                    </div>
                    <div class="temp-display">
                        <span class="temp-val">22</span>°C
                    </div>
                    <div class="weather-desc">Partly Cloudy</div>
                </div>
                <div class="forecast-grid">
                    <div class="forecast-day"><span>Mon</span><i class="fas fa-sun"></i> 24°</div>
                    <div class="forecast-day"><span>Tue</span><i class="fas fa-cloud-showers-heavy"></i> 18°</div>
                    <div class="forecast-day"><span>Wed</span><i class="fas fa-cloud-sun"></i> 21°</div>
                    <div class="forecast-day"><span>Thu</span><i class="fas fa-cloud"></i> 19°</div>
                </div>
            </div>
            <style>
                .weather-app { padding: 20px; text-align: center; }
                .weather-header { display: flex; gap: 10px; margin-bottom: 25px; }
                .weather-header input { flex-grow: 1; padding: 8px; border-radius: 20px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.05); color: var(--text-color); }
                .weather-header button { background: var(--accent-color); color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; }
                .weather-main { margin-bottom: 30px; }
                .weather-icon { font-size: 4rem; color: #f1c40f; margin-bottom: 10px; }
                .temp-display { font-size: 3rem; font-weight: bold; }
                .weather-desc { opacity: 0.7; font-size: 1.1rem; }
                .forecast-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
                .forecast-day { background: rgba(0,0,0,0.05); padding: 10px; border-radius: 10px; font-size: 0.8rem; }
                .forecast-day span { display: block; margin-bottom: 5px; opacity: 0.6; }
                .forecast-day i { display: block; margin-bottom: 5px; font-size: 1.2rem; }
            </style>
        `;
    },

    refresh() {
        const city = document.getElementById('weather-city-input').value;
        if (city) {
            Storage.save('weather-city', city);
            Utils.showToast(`Loading weather for ${city}...`, 'info');
            // In a real app, fetch from API here. For now, just mock refresh.
            setTimeout(() => {
                const temp = Math.floor(Math.random() * 15) + 15;
                document.querySelector('.temp-val').textContent = temp;
                Utils.showToast(`Weather updated!`, 'success');
            }, 1000);
        }
    }
};
