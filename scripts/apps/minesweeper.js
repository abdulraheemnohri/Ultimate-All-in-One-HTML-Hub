/**
 * Minesweeper Game
 */

const MinesweeperApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.size = 10;
        this.minesCount = 15;
        this.reset();
        this.render();
        return () => {};
    },

    reset() {
        this.grid = [];
        this.gameOver = false;
        this.revealedCount = 0;
        this.createBoard();
    },

    createBoard() {
        // Init grid
        for (let r = 0; r < this.size; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.size; c++) {
                this.grid[r][c] = { mine: false, revealed: false, flagged: false, count: 0 };
            }
        }
        // Place mines
        let placed = 0;
        while (placed < this.minesCount) {
            let r = Math.floor(Math.random() * this.size);
            let c = Math.floor(Math.random() * this.size);
            if (!this.grid[r][c].mine) {
                this.grid[r][c].mine = true;
                placed++;
            }
        }
        // Calc counts
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c].mine) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (this.grid[r + i] && this.grid[r + i][c + j] && this.grid[r + i][c + j].mine) count++;
                    }
                }
                this.grid[r][c].count = count;
            }
        }
    },

    render() {
        this.container.innerHTML = `
            <div class="mines-app">
                <div class="mines-info">Mines: ${this.minesCount} | <button onclick="MinesweeperApp.restart()">Reset</button></div>
                <div id="mines-grid" class="mines-grid"></div>
            </div>
            <style>
                .mines-app { padding: 20px; text-align: center; }
                .mines-grid {
                    display: grid;
                    grid-template-columns: repeat(${this.size}, 30px);
                    gap: 2px;
                    justify-content: center;
                    margin-top: 15px;
                }
                .cell {
                    width: 30px; height: 30px; background: #bbb; border: 1px solid #999;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: bold; cursor: pointer; user-select: none;
                }
                .cell.revealed { background: #ddd; cursor: default; }
                .cell.mine { background: #f44336; }
                .cell.flagged { color: #f44336; }
            </style>
        `;
        this.drawGrid();
    },

    drawGrid() {
        const gridEl = document.getElementById('mines-grid');
        gridEl.innerHTML = '';
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const cell = this.grid[r][c];
                const el = document.createElement('div');
                el.className = 'cell';
                if (cell.revealed) {
                    el.classList.add('revealed');
                    if (cell.mine) {
                        el.innerHTML = '<i class="fas fa-bomb"></i>';
                        el.classList.add('mine');
                    } else if (cell.count > 0) {
                        el.textContent = cell.count;
                        el.style.color = ['blue', 'green', 'red', 'darkblue', 'brown', 'cyan', 'black', 'grey'][cell.count - 1];
                    }
                } else if (cell.flagged) {
                    el.innerHTML = '<i class="fas fa-flag"></i>';
                    el.classList.add('flagged');
                }

                el.onclick = () => this.reveal(r, c);
                el.oncontextmenu = (e) => { e.preventDefault(); this.toggleFlag(r, c); };
                gridEl.appendChild(el);
            }
        }
    },

    reveal(r, c) {
        if (this.gameOver || this.grid[r][c].revealed || this.grid[r][c].flagged) return;

        this.grid[r][c].revealed = true;
        this.revealedCount++;

        if (this.grid[r][c].mine) {
            this.gameOver = true;
            this.revealAll();
            alert('Game Over! You hit a mine.');
        } else if (this.grid[r][c].count === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (this.grid[r + i] && this.grid[r + i][c + j]) this.reveal(r + i, c + j);
                }
            }
        }

        if (this.revealedCount === this.size * this.size - this.minesCount) {
            this.gameOver = true;
            alert('Congratulations! You won!');
        }
        this.drawGrid();
    },

    toggleFlag(r, c) {
        if (this.gameOver || this.grid[r][c].revealed) return;
        this.grid[r][c].flagged = !this.grid[r][c].flagged;
        this.drawGrid();
    },

    revealAll() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                this.grid[r][c].revealed = true;
            }
        }
    },

    restart() {
        this.reset();
        this.render();
    }
};
