const QuizApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.quizzes = Storage.load('quizzes') || [
            { id: '1', title: 'HTML Basics', questions: [
                { q: 'What does HTML stand for?', a: 'HyperText Markup Language' },
                { q: 'What tag is used for links?', a: '<a>' }
            ]}
        ];
        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="quiz-app">
                <div class="quiz-list">
                    <h3>My Quizzes</h3>
                    <button onclick="QuizApp.newQuiz()">+ Create Quiz</button>
                    <ul>
                        ${this.quizzes.map(q => `<li onclick="QuizApp.startQuiz('${q.id}')">${q.title}</li>`).join('')}
                    </ul>
                </div>
                <div id="quiz-area"></div>
            </div>
            <style>
                .quiz-app { display: flex; gap: 20px; height: 100%; }
                .quiz-list { width: 150px; border-right: 1px solid var(--border-color); }
                .quiz-list ul { list-style: none; padding: 0; }
                .quiz-list li { padding: 8px; cursor: pointer; border-radius: 4px; }
                .quiz-list li:hover { background: rgba(0,0,0,0.05); }
                #quiz-area { flex-grow: 1; padding: 10px; }
                .question-card { background: rgba(0,0,0,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px; }
            </style>
        `;
    },

    startQuiz(id) {
        const quiz = this.quizzes.find(q => q.id === id);
        const area = document.getElementById('quiz-area');
        area.innerHTML = `
            <h2>${quiz.title}</h2>
            ${quiz.questions.map((q, i) => `
                <div class="question-card">
                    <p><strong>Q${i+1}:</strong> ${q.q}</p>
                    <button onclick="this.nextElementSibling.style.display='block'">Show Answer</button>
                    <p style="display:none; color: var(--accent-color); margin-top:10px;">Ans: ${q.a}</p>
                </div>
            `).join('')}
        `;
    },

    newQuiz() {
        // Simplified creation
        const title = prompt("Quiz Title:");
        if (title) {
            this.quizzes.push({ id: Utils.generateId(), title, questions: [] });
            Storage.save('quizzes', this.quizzes);
            this.render();
        }
    }
};
