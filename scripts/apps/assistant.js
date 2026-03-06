/**
 * Virtual Assistant App
 */

const AssistantApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="assistant-app">
                <div class="assistant-chat" id="chat-box">
                    <div class="msg bot-msg">Hello! I am your Hub Assistant. How can I help you today?</div>
                </div>
                <div class="assistant-input">
                    <input type="text" id="chat-input" placeholder="Ask me something...">
                    <button onclick="AssistantApp.sendMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <style>
                .assistant-app { display: flex; flex-direction: column; height: 100%; padding: 10px; }
                .assistant-chat { flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
                .msg { padding: 8px 12px; border-radius: 15px; max-width: 80%; font-size: 0.9rem; }
                .bot-msg { background: rgba(0, 120, 212, 0.1); align-self: flex-start; border-bottom-left-radius: 2px; }
                .user-msg { background: var(--accent-color); color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
                .assistant-input { display: flex; gap: 8px; }
                .assistant-input input { flex-grow: 1; padding: 8px; border-radius: 20px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .assistant-input button { background: var(--accent-color); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; }
            </style>
        `;

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },

    sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        const chat = document.getElementById('chat-box');
        chat.innerHTML += `<div class="msg user-msg">${text}</div>`;
        input.value = '';

        setTimeout(() => {
            const response = this.getResponse(text.toLowerCase());
            chat.innerHTML += `<div class="msg bot-msg">${response}</div>`;
            chat.scrollTop = chat.scrollHeight;
        }, 600);
    },

    getResponse(query) {
        if (query.includes('hello') || query.includes('hi')) return "Hi there! Welcome back to your hub.";
        if (query.includes('time')) return `The current time is ${new Date().toLocaleTimeString()}.`;
        if (query.includes('weather')) return "You can check the Weather app in the sidebar for detailed forecasts!";
        if (query.includes('app')) return "We have 50+ apps including To-Do, Games, and Creativity tools.";
        if (query.includes('open')) return "Just click any icon in the sidebar or double-click a desktop shortcut!";
        if (query.includes('who are you')) return "I am your personal AI assistant built into the HTML Hub OS.";
        return "I'm not sure I understand. Can you rephrase? Try asking about the time or our apps.";
    }
};
