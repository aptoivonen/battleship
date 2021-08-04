import GameBoard from "./gameboard";

const types = ["player", "ai"];
const numberOfShipsTable = {
  carrier: 1,
  battleship: 2,
  cruiser: 3,
  destroyer: 4,
  submarine: 5,
};
Object.setPrototypeOf(numberOfShipsTable, null);
const directions = ["northwards", "eastwards", "southwards", "westwards"];

class GameBoardFactory {
  #shipFactory;
  #random;
  #sample;

  constructor(shipFactory, randomizeFn, sampleFn) {
    if (arguments.length < 3) {
      throw new TypeError(
        "cannot create a gameBoardFactory: too few arguments; 3 are required"
      );
    }
    this.#shipFactory = shipFactory;
    this.#random = randomizeFn;
    this.#sample = sampleFn;
  }

  create(type) {
    if (!types.includes(type)) {
      throw new TypeError("no such player type");
    }

    let gameBoard = new GameBoard(10, 10);
    for (const [shipType, numberOfShips] of Object.entries(
      numberOfShipsTable
    )) {
      for (let n = 0; n < numberOfShips; n++) {
        gameBoard = this.#getGameBoardWithNewShip(shipType, gameBoard);
      }
    }

    return gameBoard;
  }

  #getRandomSquare(gameBoard) {
    const x = Math.floor(this.#random() * gameBoard.width);
    const y = Math.floor(this.#random() * gameBoard.height);
    return [x, y];
  }

  #getGameBoardWithNewShip(shipType, gameBoard) {
    let newGameBoard;
    let continueIteration = true;
    do {
      const randomSquare = this.#getRandomSquare(gameBoard, this.random);
      const randomDirection = this.#sample(directions);
      const ship = this.#shipFactory.create(
        shipType,
        randomSquare,
        randomDirection
      );

      try {
        newGameBoard = gameBoard.add(ship);
        continueIteration = false;
        // eslint-disable-next-line no-empty
      } catch (RangeError) {}
    } while (continueIteration);
    return newGameBoard;
  }
}

export default GameBoardFactory;
