const FinanceApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.data = Storage.load('finance') || { transactions: [], budget: 0 };
        this.render();
    },

    render() {
        const totalIncome = this.data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = this.data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;

        this.container.innerHTML = `
            <div class="finance-app">
                <div class="finance-summary">
                    <div class="summary-card"><h3>Balance</h3><p>$${balance}</p></div>
                    <div class="summary-card"><h3>Income</h3><p>$${totalIncome}</p></div>
                    <div class="summary-card"><h3>Expenses</h3><p>$${totalExpenses}</p></div>
                </div>
                <div class="transaction-form">
                    <input type="text" id="trans-title" placeholder="Description">
                    <input type="number" id="trans-amount" placeholder="Amount">
                    <select id="trans-type">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <button onclick="FinanceApp.addTransaction()">Add</button>
                </div>
                <div class="transaction-list">
                    <h3>Recent Transactions</h3>
                    <ul>
                        ${this.data.transactions.slice().reverse().map(t => `
                            <li class="${t.type}">
                                <span>${t.title}</span>
                                <span>${t.type === 'expense' ? '-' : '+'}$${t.amount}</span>
                                <button onclick="FinanceApp.removeTransaction('${t.id}')">x</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <style>
                .finance-app { display: flex; flex-direction: column; gap: 20px; }
                .finance-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .summary-card { background: rgba(0,0,0,0.05); padding: 15px; border-radius: 8px; text-align: center; }
                .summary-card h3 { font-size: 0.8rem; opacity: 0.7; }
                .summary-card p { font-size: 1.2rem; font-weight: bold; }
                .transaction-form { display: flex; gap: 10px; }
                .transaction-form input, .transaction-form select { padding: 8px; border: 1px solid var(--border-color); background: transparent; color: inherit; border-radius: 4px; }
                .transaction-form button { background: var(--accent-color); color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
                .transaction-list ul { list-style: none; }
                .transaction-list li { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--border-color); }
                .transaction-list li.income { border-left: 4px solid #27c93f; }
                .transaction-list li.expense { border-left: 4px solid #ff5f56; }
                .transaction-list li button { background: none; border: none; color: #ff5f56; cursor: pointer; }
            </style>
        `;
    },

    addTransaction() {
        const title = document.getElementById('trans-title').value;
        const amount = parseFloat(document.getElementById('trans-amount').value);
        const type = document.getElementById('trans-type').value;

        if (title && amount) {
            this.data.transactions.push({ id: Utils.generateId(), title, amount, type, date: new Date().toISOString() });
            Storage.save('finance', this.data);
            this.render();
        }
    },

    removeTransaction(id) {
        this.data.transactions = this.data.transactions.filter(t => t.id !== id);
        Storage.save('finance', this.data);
        this.render();
    }
};
