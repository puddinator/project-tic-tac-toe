const player = (symbol) => {
    return { symbol }
};

const gameBoard = (() => {
    let board = new Array(9);

    const setCell = (index, symbol) => {
        board[index] = symbol;
    };

    const checkCell = (index) => {
        return board[index];
    };

    const restart = () => {
        board = new Array(9);
    }

    return { setCell, checkCell, restart };
})();

const gameController = (() => {
    const playerOne = player('X');
    const playerTwo = player('O');

    let _turn = 1;
    let _isGameOver = false;

    function getSymbol(turn) {
        // If 1 and true, turn is odd and it is playerOne's turn
        return (turn % 2) ? playerOne.symbol : playerTwo.symbol;
    }

    const oneTurn = (index) => {
        gameBoard.setCell(index, getSymbol(_turn));
        checkWinner(index, getSymbol(_turn))
        _isGameOver == true ? displayController.updateMessage(getSymbol(_turn), _turn) :
            displayController.updateMessage(getSymbol(_turn), _turn);
        _turn++;
    };

    const checkWinner = (index, symbol) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        // Is there some combination out there where every index is matching?
        _isGameOver = winningCombinations.some((winningCombination) => {
            return winningCombination.every((requiredIndex) => gameBoard.checkCell(requiredIndex) === symbol);
        });
    };

    const getIsGameOver = () => {
        return _isGameOver;
    };

    const restart = () => {
        _turn = 1;
        _isGameOver = false;
    };

    return { getIsGameOver, oneTurn, restart };
})();

const displayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const messageContainer = document.querySelector('.message-container');
    const button = document.querySelector('button');

    function reprintBoard() {
        cells.forEach((cell, index) => {
            cell.textContent = gameBoard.checkCell(index);
        });
    }

    const updateMessage = (symbol, turn) => {
        if (gameController.getIsGameOver() == true) {
            messageContainer.textContent = `${symbol} won!`
        } else if (turn === 9) {
            messageContainer.textContent = `It's a draw!`
        } else {
            messageContainer.textContent = `${symbol}'s turn`
        }
    }

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (gameBoard.checkCell(index) == null && gameController.getIsGameOver() == false) {
                gameController.oneTurn(index);
                reprintBoard();
            }
        });
    });

    button.addEventListener('click', () => {
        cells.forEach((cell) => {
            cell.textContent = '';
            updateMessage('X', 1);
        });
        gameBoard.restart();
        gameController.restart()
    });

    return { updateMessage };
})();