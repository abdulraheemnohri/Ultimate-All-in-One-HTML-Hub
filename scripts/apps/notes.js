const NotesApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.notes = Storage.load('notes') || [];
        this.activeNote = null;
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="notes-app">
                <div class="notes-sidebar">
                    <button onclick="NotesApp.addNote()">+ New Note</button>
                    <ul id="notes-list">
                        ${this.notes.map(note => `
                            <li onclick="NotesApp.selectNote('${note.id}')" class="${this.activeNote && this.activeNote.id === note.id ? 'active' : ''}">
                                ${note.title || 'Untitled'}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="notes-editor">
                    ${this.activeNote ? `
                        <input type="text" id="note-title" placeholder="Title" value="${this.activeNote.title}" oninput="NotesApp.updateNote()">
                        <textarea id="note-content" placeholder="Start typing..." oninput="NotesApp.updateNote()">${this.activeNote.content}</textarea>
                        <button class="delete-note" onclick="NotesApp.deleteNote('${this.activeNote.id}')">Delete Note</button>
                    ` : '<div class="no-selection">Select a note or create a new one</div>'}
                </div>
            </div>
            <style>
                .notes-app { display: flex; height: 100%; gap: 20px; }
                .notes-sidebar { width: 150px; border-right: 1px solid var(--border-color); padding-right: 15px; display: flex; flex-direction: column; }
                .notes-sidebar button { padding: 10px; margin-bottom: 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                #notes-list { list-style: none; overflow-y: auto; }
                #notes-list li { padding: 8px; cursor: pointer; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                #notes-list li:hover { background: rgba(0,0,0,0.05); }
                #notes-list li.active { background: var(--accent-color); color: white; }
                .notes-editor { flex-grow: 1; display: flex; flex-direction: column; gap: 10px; }
                #note-title { font-size: 1.2rem; font-weight: bold; padding: 10px; border: none; border-bottom: 1px solid var(--border-color); background: transparent; color: inherit; }
                #note-content { flex-grow: 1; padding: 10px; border: none; resize: none; background: transparent; color: inherit; font-family: inherit; }
                .delete-note { align-self: flex-end; background: #ff5f56; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
                .no-selection { display: flex; align-items: center; justify-content: center; height: 100%; opacity: 0.5; }
            </style>
        `;
    },

    addNote() {
        const newNote = { id: Utils.generateId(), title: '', content: '', date: new Date().toISOString() };
        this.notes.unshift(newNote);
        this.activeNote = newNote;
        this.save();
        this.render();
    },

    selectNote(id) {
        this.activeNote = this.notes.find(n => n.id === id);
        this.render();
    },

    updateNote() {
        if (!this.activeNote) return;
        this.activeNote.title = document.getElementById('note-title').value;
        this.activeNote.content = document.getElementById('note-content').value;
        this.activeNote.date = new Date().toISOString();
        this.save();
        // Update the list without full re-render if possible, but for simplicity:
        const listItem = this.container.querySelector(`#notes-list li.active`);
        if (listItem) listItem.textContent = this.activeNote.title || 'Untitled';
    },

    deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.activeNote = null;
        this.save();
        this.render();
    },

    save() {
        Storage.save('notes', this.notes);
    }
};
