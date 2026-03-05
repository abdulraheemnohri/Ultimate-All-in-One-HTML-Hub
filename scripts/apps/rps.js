/**
 * Rock-Paper-Scissors Game
 */

const RPSApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.choices = ['rock', 'paper', 'scissors'];
        this.render();
        return () => {};
    },

    render() {
        this.container.innerHTML = `
            <div class="rps-app">
                <div class="rps-choices">
                    <button onclick="RPSApp.play('rock')"><i class="fas fa-hand-rock"></i><br>Rock</button>
                    <button onclick="RPSApp.play('paper')"><i class="fas fa-hand-paper"></i><br>Paper</button>
                    <button onclick="RPSApp.play('scissors')"><i class="fas fa-hand-scissors"></i><br>Scissors</button>
                </div>
                <div id="rps-result" class="rps-result">
                    <p>Make your move!</p>
                </div>
            </div>
            <style>
                .rps-app { padding: 30px; text-align: center; }
                .rps-choices { display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; }
                .rps-choices button { padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); cursor: pointer; transition: 0.2s; }
                .rps-choices button:hover { background: var(--accent-color); color: white; transform: translateY(-3px); }
                .rps-choices i { font-size: 2rem; margin-bottom: 5px; }
                .rps-result { font-size: 1.2rem; background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px; }
                .rps-result b { color: var(--accent-color); }
            </style>
        `;
    },

    play(userChoice) {
        const compChoice = this.choices[Math.floor(Math.random() * 3)];
        let result = "";

        if (userChoice === compChoice) result = "It's a tie!";
        else if (
            (userChoice === 'rock' && compChoice === 'scissors') ||
            (userChoice === 'paper' && compChoice === 'rock') ||
            (userChoice === 'scissors' && compChoice === 'paper')
        ) result = "<b>You Win!</b>";
        else result = "<b>You Lose!</b>";

        document.getElementById('rps-result').innerHTML = `
            <p>You chose <b>${userChoice}</b></p>
            <p>Computer chose <b>${compChoice}</b></p>
            <p>${result}</p>
        `;
    }
};
