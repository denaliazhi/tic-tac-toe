
/*
This code allows users to play
the classic game of tic tac toe.
*/

const statusBar = document.querySelector('.round-status');
const playBtn = document.createElement('button');
playBtn.textContent = 'play';
playBtn.addEventListener('click', playGame);
statusBar.appendChild(playBtn); 

// Create the board
const board = (function () {

    // Dynamically render board
    const n = 3;
    const grid = [];
    const boardUI = document.querySelector('.board');

    function makeSquare () {
        const squareUI = document.createElement('div');
        squareUI.classList.add('square');
        return squareUI;
    }

    for (let i = 0; i < n; i++) {
        grid[i] = [];
        for (let j = 0; j < n; j++) {
            let square = makeSquare();
            grid[i][j] = square;
            boardUI.appendChild(square);
        }
    }

    let lastMove = {
        row: undefined, 
        col: undefined
    };

    const markers = {
        X: 'assets/tic-tac-green.png',
        O: 'assets/tic-tac-white.png'
    }

    const update = function (turn, row, col, target) {
        if (target.hasChildNodes()) {
            return false;
        }

        lastMove.row = row;
        lastMove.col = col;

        const tictac = document.createElement('img');
        tictac.setAttribute('src', markers[turn.marker]);
        tictac.classList.add('marker');
        target.appendChild(tictac);

        return true;
    }

    const reset = function (msg) {

        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                let parent = grid[row][col];
                if (parent.hasChildNodes()) {
                    let child = parent.querySelector('img');
                    parent.removeChild(child);
                }
            }
        }

        statusBar.removeChild(msg);
        statusBar.appendChild(playBtn); 
    }

    const getStatus = function () {
        const win = (checkRow(lastMove.row) 
                    || checkColumn(lastMove.col) 
                    || checkDiagonal(lastMove)
                    || checkAntidiagonal(lastMove))
        if (win) {
            return 'win';
        } else if (checkDraw()) {
            return 'draw';
        }
        return 'continue';
    }

    // Helper functions

    function checkRow (row) {
        // Compare each item to first in row
        let firstItem = grid[row][0];

        if (firstItem.hasChildNodes() &&
            grid[row].every(item => (
                item.isEqualNode(firstItem))
            )) {
            console.log(`checkRow: true`);
            return true;
        }
        console.log(`checkRow: false`);
        return false;
    }

    function checkColumn (col) {
        let firstItem = grid[0][col];

        if (!firstItem.hasChildNodes()) return false; 

        for (let row = 1; row < n; row++) {
            // Compare each item to first in column
            if (!grid[row][col].isEqualNode(firstItem)) {
                console.log(`checkColumn: false`);
                return false;
            } 
        }
        console.log(`checkColumn: true`);
        return true;
    }

    function checkDiagonal ({row, col}) {
        // Last marker wasn't on diagonal
        if (row !== col) return false;

        let firstItem = grid[0][0];
        if (!firstItem.hasChildNodes()) return false;

        for (let i = 1; i < n; i++) {
            if (!grid[i][i].isEqualNode(firstItem)) {

                console.log(`checkDiagonal: false`);
                return false;
            }
        }
        console.log(`checkDiagonal: true`);
        return true;
    }

    function checkAntidiagonal ({row, col}) {

        // Last marker wasn't on antidiagonal
        if ((row + col) !== (n - 1)) return false;
        let firstItem = grid[n - 1][0];

        if (!firstItem.hasChildNodes()) return false;
        for (let i = (n - 2); i >= 0; i--) {
            let j = (n - 1) - i; 
            if (!grid[i][j].isEqualNode(firstItem)) {
                console.log(`checkAntidiagonal: false`);
                return false;
            }
        }
        console.log(`checkAntidiagonal: true`);
        return true;
    }

    function checkDraw () {
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (!grid[row][col].hasChildNodes()) return false;
            }
        }
        // All squares have markers
        console.log(`checkDraw: true`);
        return true;
    }

    return { n, update, reset, getStatus};
})();  

// Create a player (factory function)
function createPlayer (name, marker) {

    // Private variable
    let score = 0;

    const getScore = () => score;
    const giveWin = () => score++;

    return { name, marker, getScore, giveWin };
}

// Main function to run game
function playGame () {

    const players = {};
    players.one = createPlayer(prompt('Name of Player 1: '), 'X');
    players.two = createPlayer(prompt('Name of Player 2: '), 'O');

    const playerNames = document.querySelectorAll('.scoreboard h2');
    playerNames[0].textContent = players.one.name;
    playerNames[1].textContent = players.two.name;

    // Remove play button
    statusBar.removeChild(playBtn);

    let turn = ((Math.floor(Math.random() * 2) + 1) === 1 ) 
                ? players.one : players.two;

    let statusMsg = document.createElement('p');
            
    statusMsg.textContent = `it's ${turn.name}'s turn.`;
    statusBar.appendChild(statusMsg);

    // Track position of clicked square

    const squares = [...document.querySelectorAll('.square')];
    squares.forEach((square) => {
        square.addEventListener('click', (e) => {
            let rowIndex, colIndex, updated;
            const clicked = e.target;
            
            const index = squares.indexOf(clicked);
            console.log(index);

            rowIndex = Math.floor(index / board.n);
            colIndex = index % board.n;

            updated = board.update(turn, rowIndex, colIndex, clicked);

            if (updated) {
            
                switch (board.getStatus()) {
                    case 'win':
                        statusMsg.textContent = `${turn.name} wins this round.`;
                        turn.giveWin();

                        // TO DO: Update UI for scoreboard
                        
                        // Clear UI and restore play game button
                        board.reset(statusMsg); 
                        break;
                    case 'draw':
                        statusMsg.textContent = `it's a draw.`;
                        board.reset(statusMsg);
                        break;
                    case 'continue':
                        // Other player's turn
                        turn = (turn.name === players.one.name) ? players.two : players.one;
                        statusMsg.textContent = `it's ${turn.name}'s turn.`;
                        break;
                }

            } else {
                statusMsg.textContent = `space taken. try again.`;
            }
        })
    })
}

