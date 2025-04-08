// Factory wrapped in IIFE.
// Gets executed immediately and only allows the creation of one instance - singleton pattern
const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const gameboard = [];

    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameboard[i].push(Cell());
        }
    }

    const getBoard = () => gameboard;

    // Error checking may not be neede here...
    const addToken = (coords, token) => {
        let x = coords[0];
        let y = coords[1];
        // Check if the cell is occupied already
        if (
            gameboard[x][y].getToken() === 1 ||
            gameboard[x][y].getToken() === 2
        ) {
            return;
        } else {
            gameboard[x][y].assignCell(token);
        }
    };

    // Returns a cell
    const getCellByIndex = (index) => {
        if (index < 0 || index > 8) {
            return;
        }

        const i = Math.floor(index / 3);
        const j = index % 3;

        return gameboard[i][j];
    };

    const getRowColByIndex = (index) => {
        if (index < 0 || index > 8) {
            return;
        }

        const i = Math.floor(index / 3);
        const j = index % 3;

        return [i, j];
    };

    const generateRandomCell = () => {
        let randomIndex = Math.floor(Math.random() * 9);
        let randomRowCol = getRowColByIndex(randomIndex)
        let [row, col] = randomRowCol;

        // If the cell is taken, reroll otherwise return
        while (gameboard[row][col].getToken() !== 0) {
            console.log("Cell was taken, reroll!!!");
            randomRowCol = getRowColByIndex(Math.floor(Math.random() * 9));
            [row,col] = randomRowCol;
        }
        console.log("Cell was not taken");
        console.log('returning:',randomRowCol)
        return randomRowCol;
    };

    return {
        getBoard,
        addToken,
        getCellByIndex,
        getRowColByIndex,
        generateRandomCell,
    };
})();

function Cell() {
    let value = 0;

    const assignCell = (token) => {
        value = token;
    };

    const getToken = () => value;

    return { assignCell, getToken };
}

const GameManager = (function () {
    // Variable holds the 2d array
    const board = Gameboard.getBoard();
    let gameOver = false;

    // prettier-ignore
    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];

    // Create 2 player objects
    const players = [
        {
            name: "Player one",
            token: 1,
        },
        {
            name: "Player two",
            token: 2,
        },
    ];

    // Set the active player
    let activePlayer = players[0];

    // Function to switch the active player
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Function to get the current active player
    const getActivePlayer = () => activePlayer;

    const getGameOver = () => gameOver;

    // Return true if a player has a winning combination
    const checkWin = () => {
        const token = activePlayer.token;

        return winningCombinations.some((combination) =>
            combination.every(([x, y]) => board[x][y].getToken() === token)
        );
    };

    // Return true if board is full, false otherwise
    const checkBoardFull = () => {
        return board.every((row) => row.every((cell) => cell.getToken() !== 0));
    };

    const playRound = (row, col) => {
        // Place a token
        Gameboard.addToken([row, col], activePlayer.token);

        // Checks for a win
        if (checkWin()) {
            console.log(`${activePlayer.name} has won`);
            gameOver = true;
            return;
        }

        // Check for a draw
        if (checkBoardFull()) {
            console.log("It's a draw");
            gameOver = true;
            return;
        }

        // Switch player and continue playing
        updateBoard();
        switchPlayer();
        console.log(`${activePlayer.name}'s turn`);
    };

    const playRoundComputer = (row, col) => {
        // Place a token
        Gameboard.addToken([row, col], activePlayer.token);

        // Check for win
        if (checkWin()) {
            console.log(`${activePlayer.name} has won`);
            gameOver = true;
            return;
        }

        // Check for a draw
        if (checkBoardFull()) {
            console.log("It's a draw");
            gameOver = true;
            return;
        }
        //Update the board
        updateBoard();

        console.log('adding token')
        // Computer places token at random location
        Gameboard.addToken(Gameboard.generateRandomCell(), 2);
        

        // Update the board
        updateBoard()
    };

    return {
        playRound,
        getActivePlayer,
        getGameOver,
        playRoundComputer,
    };
})();

const htmlBoard = document.querySelectorAll(".cell");

function playGamePlayer() {
    htmlBoard.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            // If game is over prevent player from clicking more squares
            if (!GameManager.getGameOver()) {
                const [row, col] = Gameboard.getRowColByIndex(index);
                if (Gameboard.getBoard()[row][col].getToken() === 0) {
                    GameManager.playRound(row, col);
                    updateBoard();
                } else {
                    console.log("Can't click occupied cell");
                }
            }
        });
    });
}

function playGameComputer() {
    htmlBoard.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            // If game is over prevent player from clicking more squares
            if (!GameManager.getGameOver()) {
                const [row, col] = Gameboard.getRowColByIndex(index);
                console.log("playing computer");
                if (Gameboard.getBoard()[row][col].getToken() === 0) {
                    GameManager.playRoundComputer(row, col);
                    updateBoard();
                } else {
                    console.log("Can't click occupied cell");
                }
            }
        });
    });
}

// Writes token to UI
function updateBoard() {
    htmlBoard.forEach((cell, index) => {
        if (Gameboard.getCellByIndex(index).getToken() == 1) {
            cell.textContent = "X";
        } else if (Gameboard.getCellByIndex(index).getToken() == 2) {
            cell.textContent = "O";
        }
    });
}

const dialog = document.querySelector(".dialog-game-mode");
const gameModeForm = document.querySelector(".gamemode-form");
const pvp = document.querySelector(".pvp");
const pve = document.querySelector(".pve");

dialog.showModal()

dialog.addEventListener("close", () => {
    const gameMode = dialog.returnValue;

    console.log('gamemode',gameMode)

    if (gameMode == "player") {
        playGamePlayer();
    } else if (gameMode == "computer") {
        playGameComputer();
    }
});

// renderBoard();
