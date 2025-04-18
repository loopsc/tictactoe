const resultDialog = document.querySelector(".dialog-result");
const resultMessage = document.querySelector(".game-result");
const playAgainButton = document.querySelector(".play-again");
const closeButton = document.querySelector(".close");

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
        let randomRowCol = getRowColByIndex(randomIndex);
        let [row, col] = randomRowCol;

        // If the cell is taken, reroll otherwise return
        while (gameboard[row][col].getToken() !== 0) {
            randomRowCol = getRowColByIndex(Math.floor(Math.random() * 9));
            [row, col] = randomRowCol;
        }
        return randomRowCol;
    };

    const resetBoard = () => {
        let counter = 0;
        for (let i = 0; i < 9; i++) {
            if (getCellByIndex(i).getToken() !== 0) {
                getCellByIndex(i).assignCell(0);
                counter++;
            }
        }
        updateBoard();
    };

    return {
        getBoard,
        addToken,
        getCellByIndex,
        getRowColByIndex,
        generateRandomCell,
        resetBoard,
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
    let activeGameMode = "";

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

    const setPlayerName = (player, inputName) => {
        console.log("Value of name passed in to set to:", inputName);
        if (!inputName) {
            alert("Name cannot be empty");
        }

        if (player !== "playerOne" && player !== "playerTwo") {
            console.error(
                "Pass in correct player variable: playerOne or playerTwo"
            );
        }

        player === "playerOne"
            ? (players[0].name = inputName)
            : (players[1].name = inputName);
    };

    // Set the active player
    let activePlayer = players[0];

    // Function to switch the active player
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Function to get the current active player
    const getActivePlayer = () => activePlayer;

    const getGameOver = () => gameOver;

    const resetGameOver = () => {
        gameOver = false;
    };

    const getActiveGameMode = () => activeGameMode;

    const setActiveGameMode = (gamemode) => {
        if (gamemode !== "player" && gamemode !== "computer") {
            throw Error("gamemode must be 'player' or 'computer'");
        } else {
            activeGameMode = gamemode;
        }
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

    const displayResults = (result = "win") => {
        if (result == "win") {
            resultMessage.textContent = `${activePlayer.name} has won`;
            resultDialog.showModal();
        } else if (result == "draw") {
            resultMessage.textContent = "It's a draw";
            resultDialog.showModal();
        } else {
            throw Error(
                "displayResult() should take in 'win' or 'draw' as paremeters. Win is the default parameter if not assigned"
            );
        }
    };

    const playRoundPlayer = (row, col) => {
        // Place a token
        Gameboard.addToken([row, col], activePlayer.token);

        // Checks for a win
        if (checkWin()) {
            displayResults();

            gameOver = true;
            return;
        }

        // Check for a draw
        if (checkBoardFull()) {
            displayResults("draw");

            gameOver = true;
            return;
        }

        // Switch player and continue playing
        updateBoard();
        switchPlayer();
    };

    const playRoundComputer = (row, col) => {
        if (activePlayer.token != 1) {
            switchPlayer();
        }

        // Place a token
        Gameboard.addToken([row, col], activePlayer.token);

        // Check for win
        if (checkWin()) {
            displayResults();

            gameOver = true;
            return;
        }

        // Check for a draw
        if (checkBoardFull()) {
            displayResults("draw");

            gameOver = true;
            return;
        }
        //Update the board
        updateBoard();

        // Computer places token at random location
        Gameboard.addToken(Gameboard.generateRandomCell(), 2);

        // Update the board
        updateBoard();
    };

    return {
        playRoundPlayer,
        getActivePlayer,
        getGameOver,
        playRoundComputer,
        resetGameOver,
        getActiveGameMode,
        setActiveGameMode,
        setPlayerName,
    };
})();

const cellsNodeList = document.querySelectorAll(".cell");
const boardDiv = document.querySelector(".board-div");

boardDiv.addEventListener("click", (e) => {
    const cellIndex = Array.from(cellsNodeList).indexOf(e.target);
    const [row, col] = Gameboard.getRowColByIndex(cellIndex);

    if (GameManager.getActiveGameMode() === "player") {
        if (
            !GameManager.getGameOver() &&
            Gameboard.getBoard()[row][col].getToken() === 0
        ) {
            GameManager.playRoundPlayer(row, col);
            updateBoard();
        }
    } else if (GameManager.getActiveGameMode() === "computer") {
        if (
            !GameManager.getGameOver() &&
            Gameboard.getBoard()[row][col].getToken() === 0
        ) {
            GameManager.playRoundComputer(row, col);
            updateBoard();
        }
    }
});

// Writes token to UI
function updateBoard() {
    cellsNodeList.forEach((cell, index) => {
        if (Gameboard.getCellByIndex(index).getToken() == 1) {
            cell.textContent = "X";
        } else if (Gameboard.getCellByIndex(index).getToken() == 2) {
            cell.textContent = "O";
        } else if (Gameboard.getCellByIndex(index).getToken() == 0) {
            cell.textContent = "";
        }
    });
}

const gameModeDialog = document.querySelector(".dialog-game-mode");
const gameModeForm = document.querySelector(".gamemode-form");
const pvp = document.querySelector(".pvp");
const pve = document.querySelector(".pve");
const pOneNameChangeButton = document.querySelector(
    ".name-change-button.player-one"
);
const pTwoNameChangeButton = document.querySelector(
    ".name-change-button.player-two"
);

gameModeDialog.showModal();

gameModeDialog.addEventListener("close", () => {
    const gameMode = gameModeDialog.returnValue;

    GameManager.setActiveGameMode(gameMode);
});

resultDialog.addEventListener("close", () => {
    const gameOverAction = resultDialog.returnValue;

    if (gameOverAction == "play-again") {
        Gameboard.resetBoard();
        GameManager.resetGameOver();
        gameModeDialog.showModal();
    } else if (gameOverAction == "close") {
        Gameboard.resetBoard();
        GameManager.resetGameOver();
    }
});

pOneNameChangeButton.addEventListener("click", (e) => {
    e.preventDefault();
    const pOneNameInput = document.querySelector("#player-one-name");

    // Call method to change player name from game manager
    GameManager.setPlayerName("playerOne", pOneNameInput.value);

    pOneNameInput.value = "";
});

pTwoNameChangeButton.addEventListener("click", (e) => {
    e.preventDefault();
    const pTwoNameInput = document.querySelector("#player-two-name");

    // Call method to change player name from game manager
    GameManager.setPlayerName("playerTwo", pTwoNameInput.value);

    pTwoNameInput.value = "";
});
