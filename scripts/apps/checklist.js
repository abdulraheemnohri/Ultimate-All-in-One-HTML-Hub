/**
 * Shopping Checklist App
 */

const ChecklistApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.load();
        this.render();
        return () => {};
    },

    load() {
        this.items = Storage.load('shopping_checklist') || [];
    },

    save() {
        Storage.save('shopping_checklist', this.items);
    },

    render() {
        this.container.innerHTML = `
            <div class="checklist-app">
                <div class="add-item">
                    <input type="text" id="checklist-input" placeholder="Add new item...">
                    <button onclick="ChecklistApp.addItem()"><i class="fas fa-plus"></i></button>
                </div>
                <div id="checklist-items"></div>
            </div>
            <style>
                .checklist-app { padding: 15px; }
                .add-item { display: flex; gap: 8px; margin-bottom: 15px; }
                .add-item input { flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); }
                .add-item button { padding: 8px 12px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                .checklist-item { display: flex; align-items: center; gap: 10px; padding: 8px; border-bottom: 1px solid var(--border-color); }
                .checklist-item.checked span { text-decoration: line-through; opacity: 0.5; }
                .checklist-item span { flex-grow: 1; }
                .checklist-item i { cursor: pointer; opacity: 0.5; transition: 0.2s; }
                .checklist-item i:hover { opacity: 1; color: #ff5f56; }
            </style>
        `;

        this.itemList = document.getElementById('checklist-items');
        this.input = document.getElementById('checklist-input');

        this.input.onkeyup = (e) => { if(e.key === 'Enter') this.addItem(); };

        this.renderItems();
    },

    renderItems() {
        this.itemList.innerHTML = '';
        this.items.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = `checklist-item ${item.checked ? 'checked' : ''}`;
            el.innerHTML = `
                <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="ChecklistApp.toggleItem(${index})">
                <span>${item.text}</span>
                <i class="fas fa-trash" onclick="ChecklistApp.deleteItem(${index})"></i>
            `;
            this.itemList.appendChild(el);
        });
    },

    addItem() {
        const text = this.input.value.trim();
        if (text) {
            this.items.push({ text, checked: false });
            this.input.value = '';
            this.save();
            this.renderItems();
        }
    },

    toggleItem(index) {
        this.items[index].checked = !this.items[index].checked;
        this.save();
        this.renderItems();
    },

    deleteItem(index) {
        this.items.splice(index, 1);
        this.save();
        this.renderItems();
    }
};
