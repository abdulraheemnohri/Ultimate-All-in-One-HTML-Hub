/**
 * Timezone Converter App
 */

const TimezoneApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.updateTime();
        this.timer = setInterval(() => this.updateTime(), 1000);
        return () => clearInterval(this.timer);
    },

    render() {
        this.container.innerHTML = `
            <div class="timezone-app">
                <div class="current-time-box">
                    <label>Local Time</label>
                    <h2 id="local-time-val">00:00:00</h2>
                </div>
                <div class="timezone-list">
                    <div class="tz-item">
                        <span>New York (EST)</span>
                        <b id="tz-ny">00:00</b>
                    </div>
                    <div class="tz-item">
                        <span>London (GMT)</span>
                        <b id="tz-lon">00:00</b>
                    </div>
                    <div class="tz-item">
                        <span>Tokyo (JST)</span>
                        <b id="tz-tok">00:00</b>
                    </div>
                    <div class="tz-item">
                        <span>Dubai (GST)</span>
                        <b id="tz-dub">00:00</b>
                    </div>
                </div>
            </div>
            <style>
                .timezone-app { padding: 20px; }
                .current-time-box { text-align: center; margin-bottom: 30px; padding: 20px; background: var(--accent-color); color: white; border-radius: 12px; }
                .current-time-box h2 { font-size: 2.5rem; margin: 5px 0 0; }
                .timezone-list { display: flex; flex-direction: column; gap: 10px; }
                .tz-item { display: flex; justify-content: space-between; padding: 12px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; }
                .tz-item b { font-family: monospace; font-size: 1.1rem; }
            </style>
        `;
    },

    updateTime() {
        const now = new Date();
        document.getElementById('local-time-val').textContent = now.toLocaleTimeString();

        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

        document.getElementById('tz-ny').textContent = now.toLocaleTimeString('en-US', { ...options, timeZone: 'America/New_York' });
        document.getElementById('tz-lon').textContent = now.toLocaleTimeString('en-US', { ...options, timeZone: 'Europe/London' });
        document.getElementById('tz-tok').textContent = now.toLocaleTimeString('en-US', { ...options, timeZone: 'Asia/Tokyo' });
        document.getElementById('tz-dub').textContent = now.toLocaleTimeString('en-US', { ...options, timeZone: 'Asia/Dubai' });
    }
};
