/**
 * Lock Screen System
 */

const LockScreen = {
    init() {
        this.enabled = Storage.load('lock-enabled') || false;
        if (this.enabled) {
            this.show();
        }
    },

    show() {
        let lockEl = document.getElementById('lock-screen');
        if (!lockEl) {
            lockEl = document.createElement('div');
            lockEl.id = 'lock-screen';
            document.body.appendChild(lockEl);
        }

        const passcode = Storage.load('lock-passcode') || '1234';

        lockEl.innerHTML = `
            <div class="lock-content">
                <div class="lock-time" id="lock-time">00:00</div>
                <div class="lock-date" id="lock-date">Date</div>
                <div class="lock-prompt">Enter Passcode</div>
                <div class="passcode-input">
                    <input type="password" id="lock-pin" maxlength="4" readonly>
                </div>
                <div class="numpad">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `<button onclick="LockScreen.addDigit(${n})">${n}</button>`).join('')}
                    <button onclick="LockScreen.clear()">C</button>
                    <button onclick="LockScreen.addDigit(0)">0</button>
                    <button onclick="LockScreen.unlock()">OK</button>
                </div>
            </div>
            <style>
                #lock-screen {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1350&q=80');
                    background-size: cover; z-index: 100000; display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(20px); transition: opacity 0.5s, transform 0.5s;
                }
                .lock-content { text-align: center; color: white; background: rgba(0,0,0,0.3); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); }
                .lock-time { font-size: 5rem; font-weight: bold; }
                .lock-date { font-size: 1.5rem; margin-bottom: 30px; opacity: 0.8; }
                .lock-prompt { margin-bottom: 10px; font-weight: bold; }
                #lock-pin { background: rgba(255,255,255,0.1); border: 2px solid white; border-radius: 5px; color: white; text-align: center; font-size: 1.5rem; width: 150px; padding: 10px; margin-bottom: 20px; }
                .numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 200px; margin: 0 auto; }
                .numpad button { background: rgba(255,255,255,0.1); border: 1px solid white; color: white; padding: 15px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; transition: background 0.2s; width: 60px; height: 60px; }
                .numpad button:hover { background: rgba(255,255,255,0.3); }
            </style>
        `;

        this.updateClock();
        this.timer = setInterval(() => this.updateClock(), 1000);
    },

    updateClock() {
        const now = new Date();
        document.getElementById('lock-time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('lock-date').textContent = now.toDateString();
    },

    addDigit(n) {
        const input = document.getElementById('lock-pin');
        if (input.value.length < 4) input.value += n;
    },

    clear() {
        document.getElementById('lock-pin').value = '';
    },

    unlock() {
        const input = document.getElementById('lock-pin');
        const correct = Storage.load('lock-passcode') || '1234';
        if (input.value === correct) {
            const lockEl = document.getElementById('lock-screen');
            lockEl.style.opacity = '0';
            lockEl.style.transform = 'scale(1.1)';
            setTimeout(() => {
                lockEl.remove();
                clearInterval(this.timer);
            }, 500);
            Utils.showToast('Welcome back!', 'success');
        } else {
            Utils.showToast('Invalid Passcode', 'danger');
            this.clear();
        }
    }
};
