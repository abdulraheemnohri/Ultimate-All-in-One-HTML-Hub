/**
 * Quiz Generator App - Educational Tool
 */

const QuizGenApp = {
    init(containerId, params = {}) {
        this.containerId = containerId;
        this.quizzes = Storage.load('quiz-generator-data') || this.getDefaultQuizzes();
        this.render();
        return () => this.cleanup();
    },

    getDefaultQuizzes() {
        return [
            {
                id: '1',
                title: 'HTML Basics',
                category: 'Adult Education',
                questions: [
                    { q: 'What does HTML stand for?', a: 'HyperText Markup Language', options: ['HyperText Markup Language', 'High Tech Modern Logic', 'Hyper Tool Modern Language', 'None of these'] },
                    { q: 'Which tag is used for the largest heading?', a: 'h1', options: ['h1', 'h6', 'head', 'header'] }
                ]
            },
            {
                id: '2',
                title: 'Fun Math',
                category: 'Kids Education',
                questions: [
                    { q: 'What is 5 + 3?', a: '8', options: ['7', '8', '9', '10'] },
                    { q: 'Which number comes after 10?', a: '11', options: ['9', '10', '11', '12'] }
                ]
            }
        ];
    },

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="quiz-gen">
                <div class="qg-header">
                    <h2><i class="fas fa-question-circle"></i> Quiz Generator</h2>
                    <button class="qg-create-btn" onclick="QuizGenApp.showCreator()"><i class="fas fa-plus"></i> Create Quiz</button>
                </div>
                <div class="qg-list">
                    ${this.quizzes.map(quiz => `
                        <div class="qg-card">
                            <div class="qg-card-info">
                                <h3>${quiz.title}</h3>
                                <span class="qg-cat-tag">${quiz.category}</span>
                                <p>${quiz.questions.length} Questions</p>
                            </div>
                            <div class="qg-card-actions">
                                <button onclick="QuizGenApp.startQuiz('${quiz.id}')" class="qg-start-btn">Start Quiz</button>
                                <button onclick="QuizGenApp.deleteQuiz('${quiz.id}')" class="qg-del-btn"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <style>
                .quiz-gen { padding: 15px; color: var(--text-primary); height: 100%; display: flex; flex-direction: column; }
                .qg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .qg-create-btn { background: var(--accent-color); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; }
                .qg-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; overflow-y: auto; }
                .qg-card { background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 15px; }
                .qg-card h3 { margin-bottom: 5px; font-size: 1.1rem; }
                .qg-cat-tag { font-size: 0.75rem; background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 5px; opacity: 0.8; }
                .qg-card p { opacity: 0.6; font-size: 0.85rem; }
                .qg-card-actions { display: flex; gap: 10px; }
                .qg-start-btn { flex-grow: 1; padding: 8px; background: #4caf50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
                .qg-del-btn { padding: 8px 12px; background: rgba(255,0,0,0.1); color: #ff5f56; border: 1px solid rgba(255,0,0,0.2); border-radius: 6px; cursor: pointer; }
            </style>
        `;
    },

    showCreator() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="quiz-creator">
                <button onclick="QuizGenApp.render()" class="qg-back-btn"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>Create New Quiz</h2>
                <div class="qc-form">
                    <input type="text" id="qc-title" placeholder="Quiz Title (e.g. Science Mix)">
                    <select id="qc-category">
                        <option value="Kids Education">Kids Education</option>
                        <option value="Adult Education">Adult Education</option>
                        <option value="General">General</option>
                    </select>
                    <div id="qc-questions">
                        <div class="qc-q-entry">
                            <input type="text" placeholder="Question">
                            <input type="text" placeholder="Correct Answer">
                            <input type="text" placeholder="Wrong Option 1">
                            <input type="text" placeholder="Wrong Option 2">
                        </div>
                    </div>
                    <button onclick="QuizGenApp.addQuestionEntry()" class="qg-add-q-btn"><i class="fas fa-plus"></i> Add Question</button>
                    <button onclick="QuizGenApp.saveQuiz()" class="qg-save-btn">Save Quiz</button>
                </div>
            </div>
            <style>
                .quiz-creator { padding: 15px; overflow-y: auto; height: 100%; }
                .qg-back-btn { margin-bottom: 20px; background: none; border: 1px solid var(--border-color); color: var(--text-primary); padding: 5px 15px; border-radius: 4px; cursor: pointer; }
                .qc-form { display: flex; flex-direction: column; gap: 15px; max-width: 500px; margin: 0 auto; }
                .qc-form input, .qc-form select { padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.05); color: var(--text-primary); }
                .qc-q-entry { display: flex; flex-direction: column; gap: 5px; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px; border: 1px dashed var(--border-color); }
                .qg-add-q-btn { background: var(--accent-color); color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; opacity: 0.8; }
                .qg-save-btn { background: #4caf50; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1rem; }
            </style>
        `;
    },

    addQuestionEntry() {
        const qContainer = document.getElementById('qc-questions');
        const entry = document.createElement('div');
        entry.className = 'qc-q-entry';
        entry.innerHTML = `
            <input type="text" placeholder="Question">
            <input type="text" placeholder="Correct Answer">
            <input type="text" placeholder="Wrong Option 1">
            <input type="text" placeholder="Wrong Option 2">
        `;
        qContainer.appendChild(entry);
    },

    saveQuiz() {
        const title = document.getElementById('qc-title').value;
        const cat = document.getElementById('qc-category').value;
        const entries = document.querySelectorAll('.qc-q-entry');
        const questions = [];

        entries.forEach(entry => {
            const inputs = entry.querySelectorAll('input');
            if (inputs[0].value && inputs[1].value) {
                questions.push({
                    q: inputs[0].value,
                    a: inputs[1].value,
                    options: [inputs[1].value, inputs[2].value, inputs[3].value].filter(v => v)
                });
            }
        });

        if (!title || questions.length === 0) {
            Utils.showToast("Add a title and at least one question.", "warning");
            return;
        }

        const newQuiz = { id: Utils.generateId(), title, category: cat, questions };
        this.quizzes.push(newQuiz);
        Storage.save('quiz-generator-data', this.quizzes);
        Utils.showToast("Quiz Saved!", "success");
        this.render();
    },

    deleteQuiz(id) {
        if (confirm("Delete this quiz?")) {
            this.quizzes = this.quizzes.filter(q => q.id !== id);
            Storage.save('quiz-generator-data', this.quizzes);
            this.render();
        }
    },

    startQuiz(id) {
        const quiz = this.quizzes.find(q => q.id === id);
        if (!quiz) return;
        this.currentQuiz = JSON.parse(JSON.stringify(quiz));
        this.currentQuestionIdx = 0;
        this.score = 0;
        this.showQuestion();
    },

    showQuestion() {
        const container = document.getElementById(this.containerId);
        const q = this.currentQuiz.questions[this.currentQuestionIdx];
        const options = [...q.options].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="quiz-player">
                <div class="qp-status">Question ${this.currentQuestionIdx + 1} of ${this.currentQuiz.questions.length}</div>
                <div class="qp-progress"><div style="width: ${(this.currentQuestionIdx / this.currentQuiz.questions.length) * 100}%"></div></div>
                <h2 class="qp-question">${q.q}</h2>
                <div class="qp-options">
                    ${options.map(opt => `<button onclick="QuizGenApp.checkAnswer('${opt.replace(/'/g, "\\'")}')" class="qp-opt-btn">${opt}</button>`).join('')}
                </div>
            </div>
            <style>
                .quiz-player { padding: 30px; max-width: 600px; margin: 0 auto; text-align: center; }
                .qp-status { font-size: 0.9rem; opacity: 0.7; margin-bottom: 10px; }
                .qp-progress { width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; margin-bottom: 30px; overflow: hidden; }
                .qp-progress div { height: 100%; background: var(--accent-color); transition: 0.3s; }
                .qp-question { margin-bottom: 30px; font-size: 1.5rem; }
                .qp-options { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .qp-opt-btn { padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--window-bg); color: var(--text-primary); cursor: pointer; transition: 0.2s; font-size: 1rem; }
                .qp-opt-btn:hover { background: var(--accent-color); color: white; transform: translateY(-3px); }
                @media (max-width: 480px) { .qp-options { grid-template-columns: 1fr; } }
            </style>
        `;
    },

    checkAnswer(answer) {
        const q = this.currentQuiz.questions[this.currentQuestionIdx];
        if (answer === q.a) {
            this.score++;
            Utils.showToast("Correct!", "success", 1000);
        } else {
            Utils.showToast(`Wrong! Answer was: ${q.a}`, "danger", 2000);
        }

        setTimeout(() => {
            this.currentQuestionIdx++;
            if (this.currentQuestionIdx < this.currentQuiz.questions.length) {
                this.showQuestion();
            } else {
                this.showResults();
            }
        }, 1000);
    },

    showResults() {
        const container = document.getElementById(this.containerId);
        const percent = Math.round((this.score / this.currentQuiz.questions.length) * 100);
        container.innerHTML = `
            <div class="quiz-results">
                <i class="fas fa-trophy fa-4x" style="color: gold; margin-bottom: 20px;"></i>
                <h2>Quiz Complete!</h2>
                <div class="qr-score">${this.score} / ${this.currentQuiz.questions.length}</div>
                <div class="qr-percent">${percent}%</div>
                <button onclick="QuizGenApp.render()" class="qr-done-btn">Back to Quizzes</button>
            </div>
            <style>
                .quiz-results { padding: 50px; text-align: center; }
                .qr-score { font-size: 3rem; font-weight: bold; margin-bottom: 10px; }
                .qr-percent { font-size: 1.5rem; opacity: 0.7; margin-bottom: 30px; }
                .qr-done-btn { background: var(--accent-color); color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-weight: bold; }
            </style>
        `;
    },

    cleanup() {}
};
