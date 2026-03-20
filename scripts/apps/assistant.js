/**
 * Hub-AI Assistant v5 - Voice & System Integration
 */

const AssistantApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.recognition = null;
        this.isListening = false;
        this.setupVoice();
        this.render();
        return () => {
            if (this.recognition) this.recognition.stop();
        };
    },

    setupVoice() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleVoiceCommand(transcript);
            };
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateMicUI();
            };
        }
    },

    render() {
        this.container.innerHTML = `
            <div class="assistant-app">
                <div class="assistant-header">
                    <div class="ai-status">
                        <div class="ai-orb"></div>
                        <span>Hub-AI v5</span>
                    </div>
                    <button id="mic-btn" class="mic-btn" onclick="AssistantApp.toggleVoice()">
                        <i class="fas fa-microphone"></i>
                    </button>
                </div>
                <div class="assistant-chat" id="chat-box">
                    <div class="msg bot-msg">Hello! I am Hub-AI. I can open apps, change themes, or just chat. Try saying "Open Notes" or "Enable Dark Mode".</div>
                </div>
                <div class="assistant-input">
                    <input type="text" id="chat-input" placeholder="Type or use voice...">
                    <button onclick="AssistantApp.sendMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <style>
                .assistant-app { display: flex; flex-direction: column; height: 100%; padding: 15px; background: rgba(0,0,0,0.05); }
                .assistant-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .ai-status { display: flex; align-items: center; gap: 10px; font-weight: bold; }
                .ai-orb { width: 12px; height: 12px; background: #0078d4; border-radius: 50%; box-shadow: 0 0 10px #0078d4; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

                .mic-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: var(--accent-color); color: white; cursor: pointer; transition: 0.3s; }
                .mic-btn.listening { background: #ff5f56; animation: listening-pulse 1s infinite; }
                @keyframes listening-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

                .assistant-chat { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; padding-right: 5px; }
                .msg { padding: 10px 15px; border-radius: 18px; max-width: 85%; font-size: 0.95rem; line-height: 1.4; position: relative; }
                .bot-msg { background: white; color: #333; align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .user-msg { background: var(--accent-color); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }

                .assistant-input { display: flex; gap: 10px; background: white; padding: 5px; border-radius: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .assistant-input input { flex-grow: 1; border: none; padding: 10px 15px; outline: none; background: transparent; color: #333; }
                .assistant-input button { background: var(--accent-color); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; }

                .dark-theme .bot-msg { background: #333; color: white; }
                .dark-theme .assistant-input { background: #444; }
                .dark-theme .assistant-input input { color: white; }
            </style>
        `;

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },

    toggleVoice() {
        if (!this.recognition) {
            Utils.showToast("Speech recognition not supported in this browser.", "danger");
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.isListening = true;
            this.recognition.start();
            this.updateMicUI();
        }
    },

    updateMicUI() {
        const btn = document.getElementById('mic-btn');
        if (btn) {
            btn.classList.toggle('listening', this.isListening);
            btn.innerHTML = this.isListening ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-microphone"></i>';
        }
    },

    sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';
        this.processQuery(text);
    },

    handleVoiceCommand(text) {
        this.addMessage(text, 'user');
        this.processQuery(text);
    },

    addMessage(text, sender) {
        const chat = document.getElementById('chat-box');
        const msg = document.createElement('div');
        msg.className = `msg ${sender}-msg`;
        msg.textContent = text;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    processQuery(query) {
        query = query.toLowerCase();
        let response = "I'm not sure how to do that yet. Try 'Open [App Name]' or 'Enable Dark Mode'.";

        if (query.includes('open')) {
            const apps = ['todo', 'notes', 'calendar', 'games', 'calculator', 'files', 'terminal', 'sketchpad'];
            let found = false;
            apps.forEach(app => {
                if (query.includes(app)) {
                    Hub.openApp(app === 'files' ? 'file-manager' : app);
                    response = `Opening ${app.charAt(0).toUpperCase() + app.slice(1)} for you.`;
                    found = true;
                }
            });
            if (!found && query.includes('settings')) { Hub.openApp('settings'); response = "Opening Settings."; found = true; }
        } else if (query.includes('dark mode')) {
            if (!document.body.classList.contains('dark-theme')) Hub.toggleTheme();
            response = "Dark mode enabled.";
        } else if (query.includes('light mode')) {
            if (document.body.classList.contains('dark-theme')) Hub.toggleTheme();
            response = "Light mode enabled.";
        } else if (query.includes('time')) {
            response = `It is currently ${new Date().toLocaleTimeString()}.`;
        } else if (query.includes('hello') || query.includes('hi')) {
            response = "Hello! How can I assist you in the Hub today?";
        } else if (query.includes('who are you')) {
            response = "I am Hub-AI v5, your personal system assistant.";
        } else if (query.includes('clear')) {
            document.getElementById('chat-box').innerHTML = '';
            response = "Chat cleared.";
        }

        setTimeout(() => this.addMessage(response, 'bot'), 600);
    }
};
