/**
 * Reading List / Book Log App
 */

const ReadingListApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.load();
        this.render();
        return () => {};
    },

    load() {
        this.books = Storage.load('reading_list') || [];
    },

    save() {
        Storage.save('reading_list', this.books);
    },

    render() {
        this.container.innerHTML = `
            <div class="reading-app">
                <header>
                    <button onclick="ReadingListApp.showForm()"><i class="fas fa-plus"></i> Add Book</button>
                </header>
                <div id="book-grid"></div>
                <div id="book-form-overlay" class="overlay" style="display:none">
                    <div class="modal">
                        <h3>Add New Book</h3>
                        <input type="text" id="book-title" placeholder="Title">
                        <input type="text" id="book-author" placeholder="Author">
                        <select id="book-status">
                            <option value="To Read">To Read</option>
                            <option value="Reading">Reading</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <div class="modal-buttons">
                            <button onclick="ReadingListApp.addBook()">Save</button>
                            <button class="secondary" onclick="ReadingListApp.hideForm()">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .reading-app { padding: 15px; }
                .reading-app header { margin-bottom: 15px; }
                .reading-app header button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                #book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
                .book-card { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; position: relative; }
                .book-card h4 { margin: 0 0 5px; font-size: 0.95rem; }
                .book-card p { margin: 0; font-size: 0.8rem; opacity: 0.7; }
                .book-status { display: inline-block; margin-top: 10px; font-size: 0.75rem; padding: 2px 6px; border-radius: 10px; background: var(--accent-color); color: white; }
                .book-card .delete-btn { position: absolute; top: 5px; right: 5px; cursor: pointer; opacity: 0; transition: 0.2s; font-size: 0.8rem; }
                .book-card:hover .delete-btn { opacity: 0.5; }
                .book-card .delete-btn:hover { opacity: 1; color: #ff5f56; }

                .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal { background: var(--window-bg); backdrop-filter: var(--glass-effect); padding: 20px; border-radius: 12px; width: 300px; display: flex; flex-direction: column; gap: 10px; }
                .modal input, .modal select { padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .modal-buttons { display: flex; gap: 10px; margin-top: 10px; }
                .modal-buttons button { flex: 1; padding: 8px; border-radius: 4px; border: none; cursor: pointer; background: var(--accent-color); color: white; }
                .modal-buttons button.secondary { background: rgba(0,0,0,0.1); color: var(--text-color); }
            </style>
        `;

        this.grid = document.getElementById('book-grid');
        this.renderBooks();
    },

    renderBooks() {
        this.grid.innerHTML = '';
        this.books.forEach((book, index) => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <h4>${book.title}</h4>
                <p>by ${book.author}</p>
                <span class="book-status">${book.status}</span>
                <i class="fas fa-trash delete-btn" onclick="ReadingListApp.deleteBook(${index})"></i>
            `;
            this.grid.appendChild(card);
        });
    },

    showForm() {
        document.getElementById('book-form-overlay').style.display = 'flex';
    },

    hideForm() {
        document.getElementById('book-form-overlay').style.display = 'none';
    },

    addBook() {
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const status = document.getElementById('book-status').value;

        if (title) {
            this.books.push({ title, author, status });
            this.save();
            this.renderBooks();
            this.hideForm();
            // Clear inputs
            document.getElementById('book-title').value = '';
            document.getElementById('book-author').value = '';
        }
    },

    deleteBook(index) {
        this.books.splice(index, 1);
        this.save();
        this.renderBooks();
    }
};
