/**
 * Recipe Organizer App
 */

const RecipeApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.load();
        this.render();
        return () => {};
    },

    load() {
        this.recipes = Storage.load('recipes') || [];
    },

    save() {
        Storage.save('recipes', this.recipes);
    },

    render() {
        this.container.innerHTML = `
            <div class="recipe-app">
                <header>
                    <button onclick="RecipeApp.showAddForm()"><i class="fas fa-plus"></i> Add Recipe</button>
                </header>
                <div id="recipe-list"></div>

                <div id="recipe-modal" class="modal-overlay" style="display:none">
                    <div class="hub-modal">
                        <h3>New Recipe</h3>
                        <input type="text" id="recipe-name" placeholder="Recipe Name">
                        <textarea id="recipe-content" placeholder="Ingredients & Steps..."></textarea>
                        <div class="modal-actions">
                            <button onclick="RecipeApp.addRecipe()">Save</button>
                            <button class="secondary" onclick="RecipeApp.hideAddForm()">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .recipe-app { padding: 15px; }
                .recipe-app header { margin-bottom: 20px; }
                .recipe-app header button { padding: 8px 15px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .recipe-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 10px; }
                .recipe-item h4 { margin: 0 0 5px; color: var(--accent-color); }
                .recipe-item pre { white-space: pre-wrap; font-family: inherit; font-size: 0.9rem; margin: 10px 0; }
                .recipe-item .actions { text-align: right; }
                .recipe-item .actions i { cursor: pointer; color: #ff5f56; opacity: 0.7; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .hub-modal { background: var(--window-bg); backdrop-filter: var(--glass-effect); padding: 20px; border-radius: 12px; width: 350px; display: flex; flex-direction: column; gap: 10px; }
                .hub-modal input, .hub-modal textarea { padding: 10px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .hub-modal textarea { height: 150px; resize: none; }
                .modal-actions { display: flex; gap: 10px; }
                .modal-actions button { flex: 1; padding: 10px; border-radius: 4px; border: none; cursor: pointer; background: var(--accent-color); color: white; }
                .modal-actions button.secondary { background: rgba(0,0,0,0.1); color: var(--text-color); }
            </style>
        `;
        this.renderList();
    },

    renderList() {
        const list = document.getElementById('recipe-list');
        list.innerHTML = this.recipes.length ? '' : '<p style="text-align:center; opacity: 0.5;">No recipes yet.</p>';
        this.recipes.forEach((recipe, index) => {
            const el = document.createElement('div');
            el.className = 'recipe-item';
            el.innerHTML = `
                <h4>${recipe.name}</h4>
                <pre>${recipe.content}</pre>
                <div class="actions"><i class="fas fa-trash" onclick="RecipeApp.deleteRecipe(${index})"></i></div>
            `;
            list.appendChild(el);
        });
    },

    showAddForm() { document.getElementById('recipe-modal').style.display = 'flex'; },
    hideAddForm() { document.getElementById('recipe-modal').style.display = 'none'; },

    addRecipe() {
        const name = document.getElementById('recipe-name').value.trim();
        const content = document.getElementById('recipe-content').value.trim();
        if (name && content) {
            this.recipes.push({ name, content });
            this.save();
            this.renderList();
            this.hideAddForm();
            document.getElementById('recipe-name').value = '';
            document.getElementById('recipe-content').value = '';
        }
    },

    deleteRecipe(index) {
        if(confirm('Delete recipe?')) {
            this.recipes.splice(index, 1);
            this.save();
            this.renderList();
        }
    }
};
