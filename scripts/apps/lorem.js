/**
 * Lorem Ipsum Generator App
 */

const LoremApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat"];
        this.render();
        this.generate();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="lorem-app">
                <div class="lorem-controls">
                    <label>Paragraphs</label>
                    <input type="number" id="lorem-count" value="3" min="1" max="20">
                    <button onclick="LoremApp.generate()">Generate</button>
                    <button class="secondary" onclick="LoremApp.copy()">Copy</button>
                </div>
                <div id="lorem-result" class="lorem-result"></div>
            </div>
            <style>
                .lorem-app { padding: 20px; display: flex; flex-direction: column; gap: 15px; height: 100%; }
                .lorem-controls { display: flex; gap: 10px; align-items: center; }
                .lorem-controls input { width: 60px; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .lorem-controls button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .lorem-controls button.secondary { background: rgba(0,0,0,0.1); color: var(--text-color); }
                .lorem-result { flex-grow: 1; padding: 15px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow-y: auto; line-height: 1.6; }
            </style>
        `;
    },

    generate() {
        const count = parseInt(document.getElementById('lorem-count').value);
        let result = "";
        for (let i = 0; i < count; i++) {
            result += "<p>" + this.generateParagraph() + "</p>";
        }
        document.getElementById('lorem-result').innerHTML = result;
    },

    generateParagraph() {
        let p = [];
        const len = Math.floor(Math.random() * 50) + 30;
        for (let i = 0; i < len; i++) {
            p.push(this.words[Math.floor(Math.random() * this.words.length)]);
        }
        let s = p.join(' ');
        return s.charAt(0).toUpperCase() + s.slice(1) + ".";
    },

    copy() {
        const text = document.getElementById('lorem-result').innerText;
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    }
};
