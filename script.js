
/*
This code allows users to play
the classic game of tic tac toe.
*/

const statusBar = document.querySelector('.round-status');
const playBtn = document.createElement('button');

playBtn.textContent = 'play';
playBtn.addEventListener("click", () => {
    // playGame();
})

statusBar.appendChild(playBtn);

// Create the board
const board = (function () {
    const n = 3;
    const grid = Array.from(
                    { length: n },
                    () => new Array(n).fill() 
                    // Explicitly fills w/ undefined
                );
    console.log(grid);

    let lastMove = {
        row: undefined, 
        col: undefined
    };

    const update = function (marker, row, col) {
        if (grid[row][col] !== undefined) {
            return false;
        }

        grid[row][col] = marker;
        lastMove.row = row;
        lastMove.col = col;

        return true;
    }

    const show = function () {
        // Render top border of board
        let render = '+ - + - + - +\n';

        // Render rest of board row by row
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                let pos = grid[row][col];

                // If no marker at position, show a space
                render += ((pos !== undefined) ? `| ${pos} `: '|   ');
            }
            // Render bottom border of each row
            render += '|\n+ - + - + - +\n'
        }
        return render;
    }

    const reset = function () {
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                grid[row][col] = undefined;
            }
        }
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

        if (firstItem &&
            grid[row].every(item => (
                item === firstItem )
            )) {
            console.log(`checkRow: true`);
            return true;
        }
        console.log(`checkRow: false`);
        return false;
    }

    function checkColumn (col) {
        let firstItem = grid[0][col];

        if (!firstItem) return false; 

        for (let row = 1; row < n; row++) {
            // Compare each item to first in column
            if (grid[row][col] !== firstItem) {
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
        if (!firstItem) return false;

        for (let i = 1; i < n; i++) {
            if (grid[i][i] !== firstItem) {

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

        if (!firstItem) return false;
        for (let i = (n - 2); i >= 0; i--) {
            let j = (n - 1) - i; 
            if (grid[i][j] !== firstItem) {
                console.log(`checkAntidiagonal: false`);
                return false;
            }
        }
        console.log(`checkAntidiagonal: true`);
        return true;
    }

    function checkDraw () {
        for (let row = 0; row < n; row++) {
            if (grid[row].includes(undefined)) return false;
        }
        // All items defined but no win
        console.log(`checkDraw: true`);
        return true;
    }

    return { update, show, reset, getStatus};
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
    
    let playRound = true;
    while (playRound) {
        console.log('New round!');
        console.log(board.show());

        let turn = ((Math.floor(Math.random() * 2) + 1) === 1 ) 
                    ? players.one : players.two;
        let keepPlaying = true;
        
        while (keepPlaying) {
            console.log(`It's ${turn.name}'s turn.`);

            let resp = prompt('Place your piece: x, y');
            let position = resp.split(',');

            // Piece successfully placed
            if (board.update(turn.marker, +position[0], +position[1])) {
                switch (board.getStatus()) {
                    case 'win':
                        console.log(`${turn.name} wins this round.`);
                        turn.giveWin();
                        keepPlaying = false;
                        break;
                    case 'draw':
                        console.log(`It's a draw.`);
                        keepPlaying = false;
                        break;
                    case 'continue':
                        // Other player's turn
                        turn = (turn.name === players.one.name) ? players.two : players.one;
                        break;
                }
            } else {
                console.log(`Not possible. Try again.`);
            }
            console.log(board.show());
        }
        board.reset();

        console.log(`---Score---
        ${players.one.name}: ${players.one.getScore()}
        ${players.two.name}: ${players.two.getScore()}`)
        
        playRound = prompt('Start new round? Y / N') === 'Y' ? true : false;
    }
}

