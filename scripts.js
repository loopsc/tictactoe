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

    const printBoard = () => {
        const boardWithCellValues = gameboard.map((row) =>
            row.map((cell) => cell.getToken())
        );
        console.log(boardWithCellValues);
    };

    return { getBoard, addToken, printBoard };
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

    // Function to get the current active player
    const getActivePlayer = () => activePlayer;

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

    // Initial start of game
    const startGame = () => {
        Gameboard.printBoard();
        playRound();
    };

    // Plays a single round.
    // Ends with switching player printing board announcing next player
    // Then calls then calls itself
    const playRound = () => {
        const input = prompt("Enter your move (row & column: e.g. 0 2");
        if (!input) {
            throw Error("Game aborted");
        }

        let [row, col] = input.split(" ").map(Number);

        // Validate Input
        // prettier-ignore
        if(isNaN(row) || row < 0 || row > 2 || isNaN(col) || col < 0 || col > 2){
            console.log("Invalid input. Enter row and column between 0 and 2")
            return playRound()
        }

        // Play a round
        Gameboard.addToken([row, col], getActivePlayer().token);

        // Check for a win: use the function
        if (checkWin()) {
            Gameboard.printBoard();
            console.log(`${getActivePlayer().name} has won`);
            return;
        }

        // Check for a draw
        if (checkBoardFull()) {
            console.log("It's a draw");
            return;
        }

        // Switch player and continue playing
        switchPlayer();
        Gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
        playRound();
    };

    return {
        startGame,
    };
})();

//Start the game
GameManager.startGame();
