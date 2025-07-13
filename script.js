/*
This code allows users to play
the classic game of tic tac toe.
*/

// Set up the board
// IIFE to prevent multiple boards from being created
const board = (function () {
  // Board is an n x n grid of squares
  const n = 3;
  const squares = [];
  const display = document.querySelector(".board");

  // Create and store each square in matrix
  for (let row = 0; row < n; row++) {
    squares[row] = [];
    for (let col = 0; col < n; col++) {
      let square = addSquare(row, col);
      squares[row][col] = square;
      // Render in browser
      display.appendChild(square);
    }
  }
  // Helper function to add a square
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
    if (square.hasChildNodes()) return false;

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
    // Row isn't full
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
  if (name !== null) {
    playerName.textContent = name;
  // If name is null, use default display name
  } else {
    name = playerName.textContent;
  }

  // Set score as private variable
  let score = 0;
  const playerScore = document.querySelectorAll(".scoreboard p")[i];
  const giveWin = function () {
    score++;
    playerScore.textContent = score;
  };
  return { name, marker, giveWin };
}

// Main function to run game (also IIFE)
const playGame = (function () {  
  // Custom tic tac markers
  const markers = ["assets/tic-tac-green.png", "assets/tic-tac-white.png"];

  // Render play button
  const gameBar = document.querySelector(".game-bar");
  const playButton = document.createElement("button");
  playButton.textContent = "play";
  playButton.addEventListener("click", setup, { once: true });
  gameBar.appendChild(playButton);

  // Prepare node that will replace button once clicked
  let status = document.createElement("p");

  const players = [];
  const playerCount = 2;

  // Function to complete set up and start first round
  function setup() {
    for (let i = 0; i < playerCount; i++) {
      let invalid = true;
      let name;
      do {
        name = prompt(`Name of Player ${i + 1}: `);
        if (name !== null &&
            (name.trim().length === 0 ||
            name.length > 15)
          ) {
          alert("Please enter a valid name (up to 15 characters).");
        } else {
          invalid = false;
        }
      } while (invalid);
      players[i] = createPlayer(name, markers[i], i);
    }

    playRound();
  }

  // Function to run a round
  function playRound() {
    gameBar.removeChild(playButton);
    gameBar.appendChild(status);

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
    squares.addEventListener("click", mark);

    // Event handler function
    function mark(e) {
      if (e.target.classList.contains("square")) {
        const square = e.target;
        const row = +square.getAttribute("data-row");
        const col = +square.getAttribute("data-col");

        let placed = board.placeMarker(turn, square);

        if (placed) {
          lastMove.row = row;
          lastMove.col = col;
          totalMoves++;
          evaluate();
        } else {
          status.textContent = `space taken. try again.`;
        }
      }
    }

    // Helper function to evaluate round status
    function evaluate() {
      if (board.check(turn, lastMove)) {
        status.textContent = `${turn.name} wins this round.`;
        turn.giveWin();
        squares.removeEventListener("click", mark);
        reset();
      } else if (totalMoves === board.n ** 2) {
        status.textContent = `it's a draw.`;
        squares.removeEventListener("click", mark);
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
    async function reset() {
      // Wait 2 seconds
      await delay(2000);
      gameBar.removeChild(status);
      playButton.textContent = "play again";
      playButton.addEventListener("click", () => {
        board.clear();
        playRound();
      });
      gameBar.appendChild(playButton);
    }
    // Helper function to delay reset
    // Credit: https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
})();