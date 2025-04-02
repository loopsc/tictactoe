// Factory wrapped in IIFE.
// Gets executed immediately and only allows the creation of one instance - singleton pattern
const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const gameboard = [];

    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameboard[i][j] = " ";
        }
    }

    const getBoard = () => gameboard;

    const addSymbol = (placement, symbol) => {
        const x = placement[0];
        const y = placement[1];

        if (gameboard[x][y] === " ") {
            gameboard[x][y] = symbol;
        }
        else {
            throw Error("This cell is already occupied")
        }
    };
    return { getBoard, addSymbol };
})();

const GameManager = (function (gameboard) {
    // Get access to the gameboard. TESTING ONLY
    const managerGetBoard = () => {
        return gameboard.getBoard()
    };

    // const checkWin = () => {
    //     return gameboard[1,1]
    // }

    return { managerGetBoard };
})(Gameboard);

function Player(name, symbol) {
    return (player = {
        name,
        symbol,
    });
}

const playerOne = Player("Jeff", "X");


// console.log(Gameboard.getBoard());
console.log(GameManager.managerGetBoard())

Gameboard.addSymbol([0,1], playerOne.symbol);
Gameboard.addSymbol([1,1], playerOne.symbol);
Gameboard.addSymbol([2,1], playerOne.symbol);
// console.log(`GameManager.checkWin(): ${GameManager.checkWin()}`)

