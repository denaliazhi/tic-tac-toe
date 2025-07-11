
/*
This code allows users to play
the classic game of tic tac toe.
*/

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
            return "win";
        } else if (checkDraw()) {
            return "draw";
        }
        return "continue";
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

// Factory function to create a player
function createPlayer (name, marker) {

    // Private variable
    let score = 0;

    const getScore = () => score;
    const giveWin = () => score++;

    return { name, marker, getScore, giveWin };
}

const player1 = createPlayer('Player 1', 'X');
const player2 = createPlayer('Player 2', 'O');

/*        

TO RUN THE GAME
createGame()

    1. Create `board`
    2. Prompt user to enter player names
    3. Create two `player` objects with names

    4. Randomly select player to start
       Store player name as `turn`
    5. Set `playGame` to true

    6. While `playGame` is true:
       A. Prompt user 'Start new game? Y/N'

       B. If response is 'Y':
           i. Set `playRound` to true

          ii. While `playRound` is true:
                1. Display board
                2. Prompt player with current `turn` for position
                    on which to place their marker
                3. Update board with move
                4. If update success,
                    Check status of board
                    If win
                        Increment score of player with winning marker
                        Print outcome 'Player { } won.'
                        Set `playRound` to false
                    Else if draw
                        Print outcome 'It's a draw.'
                        Set `playRound` to false
                    Else change `turn` to other player

         iii. Reset board at end of round
         iv.  Display player scores

        Else set `playGame` to false
       
*/

// board.update('O', 0, 0);
// board.update('X', 0, 1);
// board.update('X', 0, 2);
// board.update('X', 1, 0);
// board.update('O', 1, 1);
// board.update('O', 1, 2);
// board.update('X', 2, 0);
// console.log(board.getStatus());
// console.log(board.show());