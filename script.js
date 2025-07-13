/*
This code allows users to play
the classic game of tic tac toe.
*/

// Render start game button
const gameBar = document.querySelector(".game-bar");
const playButton = document.createElement("button");

playButton.textContent = "play";
playButton.addEventListener("click", playGame, { once: true });

gameBar.appendChild(playButton);

// Render the board
// IIFE to prevent multiple boards from being created
const board = (function () {
  // Board size is n x n
  const n = 3;
  const squares = [];
  const display = document.querySelector(".board");

  for (let row = 0; row < n; row++) {
    squares[row] = [];
    for (let col = 0; col < n; col++) {
      let square = addSquare(row, col);
      squares[row][col] = square;
      display.appendChild(square);
    }
  }
  // Helper function to add a square to the board
  function addSquare(row, col) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.dataset.row = row;
    square.dataset.col = col;
    return square;
  }

  /* Exposed methods */

  // Place a marker on the board
  const placeMarker = function (player, square) {
    // Square is taken
    if (square.hasChildNodes()) return false; // DOES NOT RETURN TRUE WHEN CHILD
    // Square is open
    let tictac = createMarker(player.marker);
    square.appendChild(tictac);
    return true;
  };
  // Helper function to create a marker
  function createMarker(image) {
    const marker = document.createElement("img");
    marker.setAttribute("src", image);
    marker.setAttribute("alt", "A tic tac marking the square");
    marker.classList.add("marker");
    return marker;
  }

  // Clear the board
  const clear = function () {
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        let parent = squares[row][col];
        // Remove marker if it exists
        if (parent.hasChildNodes()) {
          let child = parent.querySelector("img");
          parent.removeChild(child);
        }
      }
    }
  };

  // Check the board for win
  const check = function (player, lastMove) {
    if (
      checkRow(player, lastMove.row) ||
      checkColumn(player, lastMove.col) ||
      checkDiagonal(player, lastMove) ||
      checkAntidiagonal(player, lastMove)
    ) {
      return 1;
    }
    return 0;
  };

  // Helper function to check row for win
  function checkRow(player, row) {
    console.log("checking row");
    // Row is not full
    if (!squares[row].every((item) => item.hasChildNodes())) return false;

    // Return true if all squares in row have player's marker
    return squares[row].every((item) =>
      item.querySelector("img").src.includes(player.marker)
    );
  }

  // Helper function to check column for win
  function checkColumn(player, col) {
    console.log("checking column");
    for (let row = 0; row < n; row++) {
      let item = squares[row][col];
      if (
        !item.hasChildNodes() ||
        !item.querySelector("img").src.includes(player.marker)
      ) {
        return false;
      }
    }
    return true;
  }

  // Helper function to check diagonal for win
  function checkDiagonal(player, { row, col }) {
    console.log("checking diagonal");
    // Marker wasn't placed on diagonal
    if (row !== col) return false;

    for (let i = 0; i < n; i++) {
      let item = squares[i][i];
      if (
        !item.hasChildNodes() ||
        !item.querySelector("img").src.includes(player.marker)
      ) {
        return false;
      }
    }
    return true;
  }
  // Helper function to check anti-diagonal for win
  function checkAntidiagonal(player, { row, col }) {
    console.log("checking antidiagonal");
    // Marker wasn't placed on antidiagonal
    if (row + col !== n - 1) return false;

    for (let i = n - 1; i >= 0; i--) {
      let j = n - 1 - i;
      let item = squares[i][j];
      if (
        !item.hasChildNodes() ||
        !item.querySelector("img").src.includes(player.marker)
      ) {
        return false;
      }
    }
    return true;
  }

  return { n, placeMarker, clear, check };
})();

// Create a player (factory function)
function createPlayer(name, marker, i) {
  const playerName = document.querySelectorAll(".scoreboard h2")[i];
  playerName.textContent = name;

  // Set score as private variable
  let score = 0;
  const playerScore = document.querySelectorAll(".scoreboard p")[i];
  const giveWin = function () {
    score++;
    playerScore.textContent = score;
  };

  return { name, marker, giveWin };
}

// Main function to run game
function playGame() {
  const markers = ["assets/tic-tac-green.png", "assets/tic-tac-white.png"];

  // Set up scoreboard
  const players = [];
  const playerCount = 2;

  for (let i = 0; i < playerCount; i++) {
    players[i] = createPlayer(
      prompt(`Name of Player ${i + 1}: `),
      markers[i],
      i
    );
  }

  gameBar.removeChild(playButton);
  let status = document.createElement("p");
  gameBar.appendChild(status);

  playRound();

  // ----------------------------------------------

  // Function to run a round
  function playRound() {
    // Set up progress trackers for round
    let totalMoves = 0;
    let lastMove = {
      row: undefined,
      col: undefined,
    };

    // Randomly assign player to first turn
    let turn = players[Math.floor(Math.random() * playerCount)];
    // Update game bar to show player turn
    status.textContent = `it's ${turn.name}'s turn.`;

    // Listen for click on board
    const squares = document.querySelector(".board");
    squares.addEventListener("click", (e) => {
      if (e.target.classList.contains("square")) {
        const square = e.target;
        const row = +square.getAttribute("data-row");
        const col = +square.getAttribute("data-col");

        let placed = board.placeMarker(turn, square);
        // console.log({ row, col, placed });

        if (placed) {
          lastMove.row = row;
          lastMove.col = col;
          totalMoves++;
          evaluate();
        } else {
          status.textContent = `space taken. try again.`;
        }
      }
    });

    // Helper function to evaluate round status
    function evaluate() {
      if (board.check(turn, lastMove)) {
        status.textContent = `${turn.name} wins this round.`;
        turn.giveWin();
        reset();
      } else if (totalMoves === board.n ** 2) {
        status.textContent = `it's a draw.`;
        reset();
      } else {
        // Switch turn to other player
        if (turn === players[0]) {
          turn = players[1];
        } else {
          turn = players[0];
        }
        status.textContent = `it's ${turn.name}'s turn.`;
      }
    }
    // Helper function to reset game
    function reset() {
      gameBar.removeChild(status);
      playButton.textContent = "play again";
      // Add new event listener to button to trigger new round not new game
      gameBar.appendChild(playButton);
      board.clear();
    }
  }
}
