const FlashcardsApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.cards = Storage.load('flashcards') || [
            { id: '1', front: 'HTTP', back: 'Hypertext Transfer Protocol' },
            { id: '2', front: 'CSS', back: 'Cascading Style Sheets' }
        ];
        this.currentIndex = 0;
        this.flipped = false;
        this.render();
    },

    render() {
        if (this.cards.length === 0) {
            this.container.innerHTML = `<p>No flashcards. <button onclick="FlashcardsApp.addCard()">Add One</button></p>`;
            return;
        }

        const card = this.cards[this.currentIndex];
        this.container.innerHTML = `
            <div class="flashcards-app">
                <div class="card-container" onclick="FlashcardsApp.flip()">
                    <div class="flashcard ${this.flipped ? 'flipped' : ''}">
                        <div class="card-front">${card.front}</div>
                        <div class="card-back">${card.back}</div>
                    </div>
                </div>
                <div class="controls">
                    <button onclick="FlashcardsApp.prev()"><i class="fas fa-arrow-left"></i></button>
                    <span>${this.currentIndex + 1} / ${this.cards.length}</span>
                    <button onclick="FlashcardsApp.next()"><i class="fas fa-arrow-right"></i></button>
                    <button onclick="FlashcardsApp.addCard()">+</button>
                </div>
            </div>
            <style>
                .flashcards-app { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 30px; }
                .card-container { perspective: 1000px; width: 300px; height: 200px; cursor: pointer; }
                .flashcard { position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .flashcard.flipped { transform: rotateY(180deg); }
                .card-front, .card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; padding: 20px; font-size: 1.5rem; font-weight: bold; border-radius: 15px; background: white; border: 1px solid var(--border-color); color: #333; }
                .card-back { transform: rotateY(180deg); background: var(--accent-color); color: white; }
                .controls { display: flex; align-items: center; gap: 20px; }
            </style>
        `;
    },

    flip() {
        this.flipped = !this.flipped;
        this.container.querySelector('.flashcard').classList.toggle('flipped');
    },

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.flipped = false;
        this.render();
    },

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.flipped = false;
        this.render();
    },

    addCard() {
        const front = prompt("Front:");
        const back = prompt("Back:");
        if (front && back) {
            this.cards.push({ id: Utils.generateId(), front, back });
            Storage.save('flashcards', this.cards);
            this.currentIndex = this.cards.length - 1;
            this.flipped = false;
            this.render();
        }
    }
};
