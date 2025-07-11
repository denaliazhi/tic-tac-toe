/*

PREMISE

This app will allow users to play the classic
game 'Tic Tac Toe.' The game is played between
two people (Player 1 vs Player 2). The players
will take turns putting their respective markers 
('X' vs 'O') onto a 3x3 grid. 

The first player whose markers form 3-in-a-row 
is the winner. If the grid is full, and no player
has achieved 3-in-a-row, then the game is a draw.

================================================

PSEUDOCODE
For barebones version played in console

--------------------------
TO CREATE THE BOARD
*/

const board = (function () {
    const n = 3;
    const grid = Array.from(
                    { length: n },
                    () => new Array(n).fill() 
                    // Explicitly fills w/ undefined
                );
    console.log(grid);

    const update = function (marker, row, col) {
        if (grid[row][col] !== undefined) {
            return false;
        }
        grid[row][col] = marker;
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
        const win = (checkRow() 
                    || checkColumn() 
                    || checkDiagonal()
                    || checkAntidiagonal())
        if (win) {
            return "win";
        } else if (checkDraw()) {
            return "draw";
        }
        return "continue";
    }

    // Helper functions

    function checkRow () {
        for (let row = 0; row < n; row++) {
    
            // Compare each item to first in row
            let firstItem = grid[row][0];

            if (firstItem &&
                grid[row].every(item => (
                    item === firstItem )
                )) {
                console.log(`checkRow: true`);
                return true;
            }
        }
        console.log(`checkRow: false`);
        return false;
    }

    function checkColumn () {
        for (let col = 0; col < n; col++) {

            let win = false;
            let firstItem = grid[0][col];

            if (firstItem) { // First item is defined
                for (let row = 1; row < n; row++) {
                    // Compare each item to first in column
                    if (grid[row][col] !== firstItem) {
                        win = false;
                        break;
                    } else {
                        win = true;
                    }
                }
                console.log(`checkColumn: ${win}`);
                if (win) return true;
            }
        }

        console.log(`checkColumn: false`);
        return false;
    }

    function checkDiagonal () {
        let firstItem = grid[0][0];
        let win = true;

        if (firstItem) {
            for (let i = 1; i < n; i++) {
                if (grid[i][i] !== firstItem) {
                    win = false;
                }
            }
        } else {
            win = false;
        }
        console.log(`checkDiagonal: ${win}`);
        return win;
    }

    function checkAntidiagonal () {
        let firstItem = grid[n - 1][0];
        let win = true;

        if (firstItem) {
            for (let i = (n - 2); i >= 0; i--) {
                let j = (n - 1) - i; 
                if (grid[i][j] !== firstItem) {
                    win = false;
                }
            }
        } else {
            win = false;
        }
        console.log(`checkAntidiagonal: ${win}`);
        return win;
    }

    function checkDraw () {
        for (let row = 0; row < n; row++) {

            if (!grid[row].every(item => (
                    item !== undefined )
                )) {
                // Some item is undefined
                return false;
            }
        }
        // All items defined but no win
        console.log(`checkDraw: true`);
        return true;
    }

    return { update, show, reset, getStatus};
})();  

board.update('O', 0, 0);
board.update('X', 0, 1);
board.update('X', 0, 2);
board.update('X', 1, 0);
board.update('O', 1, 1);
board.update('O', 1, 2);
board.update('X', 2, 0);
board.update('O', 2, 1);
console.log(board.getStatus());
console.log(board.show());

/*        
--------------------------
TO CREATE EACH PLAYER
createPlayer(name, marker)

    1. Store player `name`
       Store player `marker`
    2. Initialize `score` to 0
    3. Write methods to track `score`

        A. TO UPDATE THE SCORE
           giveWin()

           1. Increment `score`

        B. TO READ THE SCORE
           getScore()

           1. Return current `score`


--------------------------
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