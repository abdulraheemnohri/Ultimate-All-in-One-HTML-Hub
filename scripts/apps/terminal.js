/**
 * Terminal App (Mock CLI)
 */

const TerminalApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.focusInput();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="terminal-app" onclick="TerminalApp.focusInput()">
                <div class="terminal-output" id="term-output">
                    <div>Welcome to HTML Hub Terminal v1.0</div>
                    <div>Type 'help' for available commands.</div>
                    <br>
                </div>
                <div class="terminal-input-line">
                    <span class="prompt">hub@user:~$</span>
                    <input type="text" id="term-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
            <style>
                .terminal-app { background: #1e1e1e; color: #00ff00; font-family: 'Courier New', Courier, monospace; height: 100%; padding: 10px; display: flex; flex-direction: column; cursor: text; }
                .terminal-output { flex-grow: 1; overflow-y: auto; white-space: pre-wrap; font-size: 0.9rem; }
                .terminal-input-line { display: flex; gap: 8px; align-items: center; }
                .prompt { color: #569cd6; font-weight: bold; }
                #term-input { background: transparent; border: none; color: white; flex-grow: 1; outline: none; font-family: inherit; font-size: inherit; }
                .term-error { color: #f44336; }
                .term-success { color: #4caf50; }
            </style>
        `;

        const input = document.getElementById('term-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                this.executeCommand(cmd);
                input.value = '';
            }
        });
    },

    focusInput() {
        const input = document.getElementById('term-input');
        if (input) input.focus();
    },

    executeCommand(cmd) {
        if (!cmd) return;

        const output = document.getElementById('term-output');
        output.innerHTML += `<div><span class="prompt">hub@user:~$</span> ${cmd}</div>`;

        const parts = cmd.toLowerCase().split(' ');
        const base = parts[0];

        switch(base) {
            case 'help':
                output.innerHTML += `
                    <div>Available commands:</div>
                    <div>- help: Show this list</div>
                    <div>- clear: Clear terminal</div>
                    <div>- ls: List available apps</div>
                    <div>- open [app]: Open an app</div>
                    <div>- theme [dark/light]: Toggle theme</div>
                    <div>- neofetch: System info</div>
                    <div>- date: Show current date</div>
                `;
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'ls':
                const apps = Array.from(document.querySelectorAll('#sidebar-nav li')).map(li => li.getAttribute('data-app'));
                output.innerHTML += `<div>Available apps:</div><div>${apps.join('  ')}</div>`;
                break;
            case 'open':
                const appId = parts[1];
                if (appId) {
                    Hub.openApp(appId);
                    output.innerHTML += `<div class="term-success">Opening ${appId}...</div>`;
                } else {
                    output.innerHTML += `<div class="term-error">Usage: open [app-id]</div>`;
                }
                break;
            case 'theme':
                const mode = parts[1];
                if (mode === 'dark' || mode === 'light') {
                    const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                    if (current !== mode) Hub.toggleTheme();
                    output.innerHTML += `<div class="term-success">Theme set to ${mode}</div>`;
                } else {
                    output.innerHTML += `<div class="term-error">Usage: theme [dark/light]</div>`;
                }
                break;
            case 'neofetch':
                output.innerHTML += `
                    <div><span style="color:#f1c40f">OS:</span> HTML Hub OS v2.0</div>
                    <div><span style="color:#f1c40f">Kernel:</span> Browser Runtime / VanillaJS</div>
                    <div><span style="color:#f1c40f">Uptime:</span> 1 day, 4 hours</div>
                    <div><span style="color:#f1c40f">Packages:</span> 50+ Mini-Apps</div>
                    <div><span style="color:#f1c40f">Shell:</span> hub-sh v1.0</div>
                    <div><span style="color:#f1c40f">Resolution:</span> ${window.innerWidth}x${window.innerHeight}</div>
                    <div><span style="color:#f1c40f">CPU:</span> JS Virtual Processor</div>
                    <div><span style="color:#f1c40f">Memory:</span> LocalStorage / IndexedDB</div>
                `;
                break;
            case 'date':
                output.innerHTML += `<div>${new Date().toString()}</div>`;
                break;
            default:
                output.innerHTML += `<div class="term-error">Command not found: ${base}</div>`;
        }

        output.scrollTop = output.scrollHeight;
    }
};
