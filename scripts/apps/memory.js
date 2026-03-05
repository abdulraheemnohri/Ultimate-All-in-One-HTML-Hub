/**
 * Memory Game App
 */

const MemoryApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.icons = ['fa-rocket', 'fa-heart', 'fa-star', 'fa-bolt', 'fa-ghost', 'fa-music', 'fa-gamepad', 'fa-lightbulb'];
        this.reset();
        this.render();
        return () => {};
    },

    reset() {
        this.cards = [...this.icons, ...this.icons]
            .sort(() => Math.random() - 0.5)
            .map(icon => ({ icon, flipped: false, matched: false }));
        this.flipped = [];
        this.moves = 0;
    },

    render() {
        this.container.innerHTML = `
            <div class="memory-app">
                <div class="memory-info">Moves: <span id="memory-moves">0</span> | <button onclick="MemoryApp.restart()">Reset</button></div>
                <div id="memory-grid" class="memory-grid"></div>
            </div>
            <style>
                .memory-app { padding: 20px; text-align: center; }
                .memory-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px; max-width: 320px; margin-left: auto; margin-right: auto; }
                .memory-card { height: 70px; background: var(--accent-color); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; transition: 0.3s; }
                .memory-card.flipped, .memory-card.matched { background: white; color: var(--accent-color); cursor: default; }
                .memory-card i { display: none; }
                .memory-card.flipped i, .memory-card.matched i { display: block; }
            </style>
        `;
        this.drawGrid();
    },

    drawGrid() {
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';
        this.cards.forEach((card, index) => {
            const el = document.createElement('div');
            el.className = `memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`;
            el.innerHTML = `<i class="fas ${card.icon}"></i>`;
            el.onclick = () => this.flip(index);
            grid.appendChild(el);
        });
    },

    flip(index) {
        if (this.flipped.length === 2 || this.cards[index].flipped || this.cards[index].matched) return;

        this.cards[index].flipped = true;
        this.flipped.push(index);
        this.drawGrid();

        if (this.flipped.length === 2) {
            this.moves++;
            document.getElementById('memory-moves').textContent = this.moves;
            this.checkMatch();
        }
    },

    checkMatch() {
        const [a, b] = this.flipped;
        if (this.cards[a].icon === this.cards[b].icon) {
            this.cards[a].matched = true;
            this.cards[b].matched = true;
            this.flipped = [];
            if (this.cards.every(c => c.matched)) alert(`Win! Moves: ${this.moves}`);
        } else {
            setTimeout(() => {
                this.cards[a].flipped = false;
                this.cards[b].flipped = false;
                this.flipped = [];
                this.drawGrid();
            }, 1000);
        }
    },

    restart() {
        this.reset();
        this.render();
    }
};
