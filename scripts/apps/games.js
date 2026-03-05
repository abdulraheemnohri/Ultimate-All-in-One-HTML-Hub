const GamesApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        return () => {
            if (this.snakeInterval) clearInterval(this.snakeInterval);
            if (this.snakeKeyHandler) document.removeEventListener('keydown', this.snakeKeyHandler);
        };
    },

    render() {
        this.container.innerHTML = `
            <div class="games-app">
                <div class="games-menu">
                    <button onclick="GamesApp.startSnake()">Snake</button>
                    <button onclick="GamesApp.startTicTacToe()">Tic Tac Toe</button>
                </div>
                <div id="game-canvas-container">
                    <p>Select a game to play!</p>
                </div>
            </div>
            <style>
                .games-app { display: flex; flex-direction: column; height: 100%; gap: 15px; }
                .games-menu { display: flex; gap: 10px; justify-content: center; }
                .games-menu button { padding: 10px 20px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; }
                #game-canvas-container { flex-grow: 1; border: 1px solid var(--border-color); background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; position: relative; }
                #snake-canvas { background: #000; display: block; }
            </style>
        `;
    },

    startSnake() {
        const container = document.getElementById('game-canvas-container');
        container.innerHTML = `
            <canvas id="snake-canvas" width="400" height="400"></canvas>
            <div id="snake-score" style="position:absolute; top:10px; left:10px;">Score: 0</div>
        `;
        this.runSnake();
    },

    runSnake() {
        if (this.snakeInterval) clearInterval(this.snakeInterval);
        if (this.snakeKeyHandler) document.removeEventListener('keydown', this.snakeKeyHandler);

        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        const box = 20;
        let score = 0;
        let snake = [{ x: 9 * box, y: 10 * box }];
        let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        let d;

        this.snakeKeyHandler = (e) => {
            if (e.keyCode == 37 && d != "RIGHT") d = "LEFT";
            else if (e.keyCode == 38 && d != "DOWN") d = "UP";
            else if (e.keyCode == 39 && d != "LEFT") d = "RIGHT";
            else if (e.keyCode == 40 && d != "UP") d = "DOWN";
        };
        document.addEventListener('keydown', this.snakeKeyHandler);

        const draw = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? "green" : "lime";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = "black";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            ctx.fillStyle = "red";
            ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (d == "LEFT") snakeX -= box;
            if (d == "UP") snakeY -= box;
            if (d == "RIGHT") snakeX += box;
            if (d == "DOWN") snakeY += box;

            if (snakeX == food.x && snakeY == food.y) {
                score++;
                document.getElementById('snake-score').textContent = "Score: " + score;
                food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
            } else {
                snake.pop();
            }

            let newHead = { x: snakeX, y: snakeY };

            if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
                clearInterval(this.snakeInterval);
                alert("Game Over! Score: " + score);
                GamesApp.startSnake();
            }

            snake.unshift(newHead);
        };

        function collision(head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x == array[i].x && head.y == array[i].y) return true;
            }
            return false;
        }

        this.snakeInterval = setInterval(draw, 100);
    },

    startTicTacToe() {
        const container = document.getElementById('game-canvas-container');
        container.innerHTML = `
            <div class="ttt-grid">
                ${Array(9).fill().map((_, i) => `<div class="ttt-cell" onclick="GamesApp.tttMove(this, ${i})"></div>`).join('')}
            </div>
            <style>
                .ttt-grid { display: grid; grid-template-columns: repeat(3, 100px); gap: 5px; background: #fff; border: 5px solid #fff; }
                .ttt-cell { width: 100px; height: 100px; background: #000; display: flex; align-items: center; justify-content: center; font-size: 3rem; cursor: pointer; }
            </style>
        `;
        this.tttBoard = Array(9).fill(null);
        this.tttTurn = 'X';
    },

    tttMove(el, i) {
        if (this.tttBoard[i] || this.checkTTTWin()) return;
        this.tttBoard[i] = this.tttTurn;
        el.textContent = this.tttTurn;
        if (this.checkTTTWin()) {
            alert(this.tttTurn + " Wins!");
        } else if (!this.tttBoard.includes(null)) {
            alert("Draw!");
        } else {
            this.tttTurn = this.tttTurn === 'X' ? 'O' : 'X';
        }
    },

    checkTTTWin() {
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let l of lines) {
            if (this.tttBoard[l[0]] && this.tttBoard[l[0]] === this.tttBoard[l[1]] && this.tttBoard[l[0]] === this.tttBoard[l[2]]) return true;
        }
        return false;
    }
};
