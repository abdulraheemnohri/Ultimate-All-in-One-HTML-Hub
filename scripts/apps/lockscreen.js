/**
 * Lock Screen System v5 - Multi-User Support
 */

const LockScreen = {
    init() {
        this.show();
    },

    show() {
        let lockEl = document.getElementById('lock-screen');
        if (!lockEl) {
            lockEl = document.createElement('div');
            lockEl.id = 'lock-screen';
            document.body.appendChild(lockEl);
        }

        const users = Storage.listUsers();

        lockEl.innerHTML = `
            <div class="lock-content">
                <div class="lock-time" id="lock-time">00:00</div>
                <div class="lock-date" id="lock-date">Date</div>

                <div id="user-selection" class="user-list">
                    ${users.map(user => `
                        <div class="user-pill" onclick="LockScreen.selectUser('${user}')">
                            <i class="fas fa-user-circle"></i>
                            <span>${user.charAt(0).toUpperCase() + user.slice(1)}</span>
                        </div>
                    `).join('')}
                    <div class="user-pill" onclick="LockScreen.promptAddUser()">
                        <i class="fas fa-plus-circle"></i>
                        <span>Add User</span>
                    </div>
                </div>

                <div id="pin-area" style="display:none">
                    <div class="lock-prompt">Enter PIN for <span id="selected-username"></span></div>
                    <div class="passcode-input">
                        <input type="password" id="lock-pin" maxlength="4" readonly>
                    </div>
                    <div class="numpad">
                        ${[1,2,3,4,5,6,7,8,9].map(n => `<button onclick="LockScreen.addDigit(${n})">${n}</button>`).join('')}
                        <button onclick="LockScreen.clear()">C</button>
                        <button onclick="LockScreen.addDigit(0)">0</button>
                        <button onclick="LockScreen.unlock()">OK</button>
                    </div>
                    <button class="back-btn" onclick="LockScreen.showUsers()">Back to Users</button>
                </div>
            </div>
            <style>
                #lock-screen {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    background-size: cover; z-index: 100000; display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(20px); transition: opacity 0.5s, transform 0.5s;
                }
                .lock-content { text-align: center; color: white; background: rgba(0,0,0,0.4); padding: 40px; border-radius: 30px; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); width: 400px; }
                .lock-time { font-size: 4rem; font-weight: 300; }
                .lock-date { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.7; }

                .user-list { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
                .user-pill { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; gap: 10px; }
                .user-pill:hover { background: rgba(255,255,255,0.2); transform: translateY(-5px); }
                .user-pill i { font-size: 2.5rem; }

                .lock-prompt { margin-bottom: 10px; font-weight: bold; }
                #lock-pin { background: rgba(255,255,255,0.1); border: 2px solid white; border-radius: 5px; color: white; text-align: center; font-size: 1.5rem; width: 150px; padding: 10px; margin-bottom: 20px; }
                .numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 220px; margin: 0 auto; }
                .numpad button { background: rgba(255,255,255,0.1); border: 1px solid white; color: white; padding: 15px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; transition: background 0.2s; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; }
                .numpad button:hover { background: rgba(255,255,255,0.3); }
                .back-btn { margin-top: 20px; background: none; border: none; color: white; text-decoration: underline; cursor: pointer; opacity: 0.7; }
            </style>
        `;

        this.updateClock();
        this.timer = setInterval(() => this.updateClock(), 1000);
    },

    updateClock() {
        const now = new Date();
        const timeEl = document.getElementById('lock-time');
        const dateEl = document.getElementById('lock-date');
        if (timeEl) timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (dateEl) dateEl.textContent = now.toDateString();
    },

    selectUser(user) {
        this.pendingUser = user;
        document.getElementById('user-selection').style.display = 'none';
        document.getElementById('pin-area').style.display = 'block';
        document.getElementById('selected-username').textContent = user.charAt(0).toUpperCase() + user.slice(1);
        this.clear();
    },

    showUsers() {
        document.getElementById('user-selection').style.display = 'grid';
        document.getElementById('pin-area').style.display = 'none';
    },

    promptAddUser() {
        const name = prompt("Enter new username:");
        if (name) {
            const users = Storage.listUsers();
            if (!users.includes(name.toLowerCase())) {
                users.push(name.toLowerCase());
                localStorage.setItem('hub_users', JSON.stringify(users));
                const pin = prompt("Set a 4-digit PIN for this user (default 1234):", "1234");
                localStorage.setItem(`hub_${name.toLowerCase()}_lock-passcode`, JSON.stringify(pin || "1234"));
                this.show();
            } else {
                alert("Username already exists.");
            }
        }
    },

    addDigit(n) {
        const input = document.getElementById('lock-pin');
        if (input.value.length < 4) input.value += n;
    },

    clear() {
        const pin = document.getElementById('lock-pin');
        if (pin) pin.value = '';
    },

    unlock() {
        const input = document.getElementById('lock-pin');
        const user = this.pendingUser;
        // Load PIN from user-specific storage
        const userPinRaw = localStorage.getItem(`hub_${user}_lock-passcode`);
        const correct = userPinRaw ? JSON.parse(userPinRaw) : '1234';

        if (input.value === correct) {
            Storage.setUser(user);
            const lockEl = document.getElementById('lock-screen');
            lockEl.style.opacity = '0';
            lockEl.style.transform = 'scale(1.1)';
            lockEl.style.pointerEvents = 'none';
            setTimeout(() => {
                lockEl.remove();
                clearInterval(this.timer);
                // Re-initialize Hub with new user data
                location.reload();
            }, 500);
        } else {
            Utils.showToast('Invalid PIN', 'danger');
            this.clear();
        }
    }
};
