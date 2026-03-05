const TodoApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.todos = Storage.load('todo') || [];
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="todo-app">
                <div class="input-group">
                    <input type="text" id="todo-input" placeholder="What needs to be done?">
                    <button onclick="TodoApp.addTodo()">Add</button>
                </div>
                <ul id="todo-list">
                    ${this.todos.map(todo => `
                        <li class="${todo.completed ? 'completed' : ''}">
                            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="TodoApp.toggleTodo('${todo.id}')">
                            <span>${todo.text}</span>
                            <button onclick="TodoApp.removeTodo('${todo.id}')"><i class="fas fa-trash"></i></button>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <style>
                .todo-app .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
                .todo-app input[type="text"] { flex-grow: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: transparent; color: inherit; }
                .todo-app button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .todo-app ul { list-style: none; }
                .todo-app li { display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid var(--border-color); }
                .todo-app li.completed span { text-decoration: line-through; opacity: 0.6; }
                .todo-app li span { flex-grow: 1; }
                .todo-app li button { background: #ff5f56; padding: 5px 8px; font-size: 0.8rem; }
            </style>
        `;

        const input = document.getElementById('todo-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    },

    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();
        if (text) {
            const newTodo = { id: Utils.generateId(), text, completed: false };
            this.todos.push(newTodo);
            this.save();
            this.render();
        }
    },

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    },

    removeTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    },

    save() {
        Storage.save('todo', this.todos);
    }
};
