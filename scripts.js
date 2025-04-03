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

    const addToken = (coords, player) => {
        let x = coords[0];
        let y = coords[1];
        if (
            gameboard[x][y].getToken() === 1 ||
            gameboard[x][y].getToken() === 2
        )
            return;
        else {
            gameboard[x][y].addToken(player);
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

    const addToken = (player) => {
        value = player;
    };

    const getToken = () => value;

    return { addToken, getToken };
}

const GameManager = (function () {
    const winningCombinations = [
        [
            [0, 0],
            [0, 1],
            [0, 2],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 2],
        ],
        [
            [2, 0],
            [2, 1],
            [2, 2],
        ],
        [
            [0, 0],
            [1, 0],
            [2, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        [
            [0, 2],
            [1, 2],
            [2, 2],
        ],
        [
            [0, 0],
            [1, 1],
            [2, 2],
        ],
        [
            [0, 2],
            [1, 1],
            [2, 0],
        ],
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
    }

    // Function to get the current active player
    const getActivePlayer = () => activePlayer;

    // Function to print a new round
    const printNewRound = () => {
        Gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    printNewRound();

    return {
        getActivePlayer,
        printNewRound,
    };
})();
