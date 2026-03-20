/**
 * Terminal App v5 (VFS Integration)
 */

const TerminalApp = {
    currentDir: '/',
    history: [],
    historyIdx: -1,

    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.focusInput();
        return () => {};
    },

    render() {
        const user = Storage.getUser();
        this.container.innerHTML = `
            <div class="terminal-app" onclick="TerminalApp.focusInput()">
                <div class="terminal-output" id="term-output">
                    <div>Ultimate Hub Terminal v2.0 (VFS Integrated)</div>
                    <div>Logged in as: ${user}</div>
                    <div>Type 'help' for available commands.</div>
                    <br>
                </div>
                <div class="terminal-input-line">
                    <span class="prompt" id="term-prompt">${user}@hub:${this.currentDir}$</span>
                    <input type="text" id="term-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
            <style>
                .terminal-app { background: #0c0c0c; color: #cccccc; font-family: 'Consolas', 'Monaco', monospace; height: 100%; padding: 12px; display: flex; flex-direction: column; cursor: text; border-radius: 0 0 8px 8px; }
                .terminal-output { flex-grow: 1; overflow-y: auto; white-space: pre-wrap; font-size: 0.95rem; line-height: 1.2; }
                .terminal-input-line { display: flex; gap: 8px; align-items: center; margin-top: 5px; }
                .prompt { color: #00ff00; font-weight: bold; }
                #term-input { background: transparent; border: none; color: white; flex-grow: 1; outline: none; font-family: inherit; font-size: inherit; }
                .term-error { color: #ff5f56; }
                .term-success { color: #27c93f; }
                .term-info { color: #0078d4; }
                .terminal-app::-webkit-scrollbar { width: 8px; }
                .terminal-app::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
            </style>
        `;

        const input = document.getElementById('term-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                this.executeCommand(cmd);
                this.history.push(cmd);
                this.historyIdx = this.history.length;
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                if (this.historyIdx > 0) {
                    this.historyIdx--;
                    input.value = this.history[this.historyIdx];
                }
            } else if (e.key === 'ArrowDown') {
                if (this.historyIdx < this.history.length - 1) {
                    this.historyIdx++;
                    input.value = this.history[this.historyIdx];
                } else {
                    this.historyIdx = this.history.length;
                    input.value = '';
                }
            }
        });
    },

    focusInput() {
        const input = document.getElementById('term-input');
        if (input) input.focus();
    },

    async executeCommand(cmd) {
        if (!cmd) return;

        const output = document.getElementById('term-output');
        const user = Storage.getUser();
        output.innerHTML += `<div><span class="prompt">${user}@hub:${this.currentDir}$</span> ${cmd}</div>`;

        const parts = cmd.split(' ');
        const base = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch(base) {
            case 'help':
                output.innerHTML += `
                    <div>System Commands:</div>
                    <div>  help, clear, ls, cd, mkdir, rm, cat, echo, open, neofetch, whoami, pwd</div>
                    <div>File Operations:</div>
                    <div>  cat [file] - Read file</div>
                    <div>  mkdir [dir] - Create folder</div>
                    <div>  rm [path] - Delete file/folder</div>
                    <div>  echo [text] > [file] - Write to file</div>
                `;
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'whoami':
                output.innerHTML += `<div>${user}</div>`;
                break;
            case 'pwd':
                output.innerHTML += `<div>${this.currentDir}</div>`;
                break;
            case 'ls':
                const files = await VFS.listFiles(this.currentDir);
                const list = files.map(f => `<span style="color: ${f.type === 'directory' ? '#569cd6' : '#cccccc'}">${f.name}</span>`).join('  ');
                output.innerHTML += `<div>${list || '(empty)'}</div>`;
                break;
            case 'cd':
                const newPath = args[0];
                if (!newPath || newPath === '/') {
                    this.currentDir = '/';
                } else if (newPath === '..') {
                    if (this.currentDir !== '/') {
                        this.currentDir = this.currentDir.substring(0, this.currentDir.lastIndexOf('/')) || '/';
                    }
                } else {
                    const target = (this.currentDir === '/' ? '' : this.currentDir) + '/' + newPath;
                    const file = await VFS.getFile(target);
                    if (file && file.type === 'directory') {
                        this.currentDir = target;
                    } else {
                        output.innerHTML += `<div class="term-error">cd: no such directory: ${newPath}</div>`;
                    }
                }
                document.getElementById('term-prompt').textContent = `${user}@hub:${this.currentDir}$`;
                break;
            case 'mkdir':
                if (args[0]) {
                    const path = (this.currentDir === '/' ? '' : this.currentDir) + '/' + args[0];
                    await VFS.writeFile(path, '', 'directory');
                    output.innerHTML += `<div class="term-success">Directory created.</div>`;
                }
                break;
            case 'cat':
                if (args[0]) {
                    const path = (this.currentDir === '/' ? '' : this.currentDir) + '/' + args[0];
                    const file = await VFS.getFile(path);
                    if (file) {
                        output.innerHTML += `<div>${file.content}</div>`;
                    } else {
                        output.innerHTML += `<div class="term-error">cat: ${args[0]}: No such file</div>`;
                    }
                }
                break;
            case 'echo':
                const redirectIdx = args.indexOf('>');
                if (redirectIdx !== -1) {
                    const content = args.slice(0, redirectIdx).join(' ');
                    const filename = args[redirectIdx + 1];
                    if (filename) {
                        const path = (this.currentDir === '/' ? '' : this.currentDir) + '/' + filename;
                        await VFS.writeFile(path, content, 'text/plain');
                        output.innerHTML += `<div class="term-success">Written to ${filename}</div>`;
                    }
                } else {
                    output.innerHTML += `<div>${args.join(' ')}</div>`;
                }
                break;
            case 'rm':
                if (args[0]) {
                    const path = (this.currentDir === '/' ? '' : this.currentDir) + '/' + args[0];
                    await VFS.deleteFile(path);
                    output.innerHTML += `<div class="term-success">Removed.</div>`;
                }
                break;
            case 'neofetch':
                output.innerHTML += `
                    <div><span style="color:#f1c40f">OS:</span> Ultimate Hub v5.0</div>
                    <div><span style="color:#f1c40f">Host:</span> ${user}-desktop</div>
                    <div><span style="color:#f1c40f">Storage:</span> IndexedDB (VFS)</div>
                    <div><span style="color:#f1c40f">User:</span> ${user}</div>
                    <div><span style="color:#f1c40f">Shell:</span> hub-bash v2.0</div>
                    <div><span style="color:#f1c40f">Apps:</span> 50+ Local / Infinite Extensions</div>
                `;
                break;
            case 'open':
                const appId = args[0];
                if (appId) {
                    Hub.openApp(appId);
                    output.innerHTML += `<div class="term-success">Opening ${appId}...</div>`;
                }
                break;
            default:
                output.innerHTML += `<div class="term-error">Command not found: ${base}</div>`;
        }

        output.scrollTop = output.scrollHeight;
    }
};
