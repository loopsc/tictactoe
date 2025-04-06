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
            return
        }

        const i = Math.floor(index / 3)
        const j = index % 3

        return gameboard[i][j]
    }

    const getRowColByIndex = (index) => {
        if (index < 0 || index > 8) {
            return
        }

        const i = Math.floor(index / 3)
        const j = index % 3

        return [i,j]
    }

    return { getBoard, addToken, getCellByIndex, getRowColByIndex };
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
            return;
        }

        // Check for a draw
        if (checkBoardFull()) {
            console.log("It's a draw");
            return;
        }

        // Switch player and continue playing
        switchPlayer();
        updateBoard()
        console.log(`${activePlayer.name}'s turn`);
    };

    return {
        playRound,
    };
})();

const htmlBoard = document.querySelectorAll(".cell");

function renderBoard() {
    htmlBoard.forEach((cell, index) => {

        cell.addEventListener("click", () => {
            const [row, col] = Gameboard.getRowColByIndex(index)

            GameManager.playRound(row,col)
            // Used to place the final token after win or board full
            updateBoard()
        })
    });
}

// Writes token to UI
function updateBoard() {
    htmlBoard.forEach((cell, index) => {
        cell.textContent = Gameboard.getCellByIndex(index).getToken();
    })
}

renderBoard()