/**
 * Vocabulary Trainer App
 */

const VocabApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.load();
        this.render();
        return () => {};
    },

    load() {
        this.words = Storage.load('vocab_words') || [
            { word: 'Ephemeral', definition: 'Lasting for a very short time.' },
            { word: 'Luminous', definition: 'Full of or shedding light.' }
        ];
    },

    save() {
        Storage.save('vocab_words', this.words);
    },

    render() {
        this.container.innerHTML = `
            <div class="vocab-app">
                <div class="add-vocab">
                    <input type="text" id="vocab-word" placeholder="New word...">
                    <input type="text" id="vocab-def" placeholder="Definition...">
                    <button onclick="VocabApp.addWord()">Add</button>
                </div>
                <div id="vocab-list" class="vocab-list"></div>
            </div>
            <style>
                .vocab-app { padding: 15px; }
                .add-vocab { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
                .add-vocab input { padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .add-vocab button { padding: 8px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .vocab-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-bottom: 10px; }
                .vocab-item b { color: var(--accent-color); font-size: 1.1rem; display: block; margin-bottom: 5px; }
                .vocab-item p { margin: 0; font-size: 0.9rem; opacity: 0.8; }
                .vocab-actions { text-align: right; }
                .vocab-actions i { cursor: pointer; color: #ff5f56; opacity: 0.7; }
            </style>
        `;
        this.renderList();
    },

    renderList() {
        const list = document.getElementById('vocab-list');
        list.innerHTML = '';
        this.words.forEach((w, index) => {
            const el = document.createElement('div');
            el.className = 'vocab-item';
            el.innerHTML = `
                <b>${w.word}</b>
                <p>${w.definition}</p>
                <div class="vocab-actions"><i class="fas fa-trash" onclick="VocabApp.deleteWord(${index})"></i></div>
            `;
            list.appendChild(el);
        });
    },

    addWord() {
        const word = document.getElementById('vocab-word').value.trim();
        const def = document.getElementById('vocab-def').value.trim();
        if (word && def) {
            this.words.push({ word, definition: def });
            this.save();
            this.renderList();
            document.getElementById('vocab-word').value = '';
            document.getElementById('vocab-def').value = '';
        }
    },

    deleteWord(index) {
        this.words.splice(index, 1);
        this.save();
        this.renderList();
    }
};
