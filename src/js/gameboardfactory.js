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
Object.freeze(numberOfShipsTable);

const directions = ["northwards", "eastwards", "southwards", "westwards"];

const boardWidth = 10;
const boardHeight = 10;

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

    let gameBoard = new GameBoard(boardWidth, boardHeight);
    if (type === "ai") {
      for (const [shipType, numberOfShips] of Object.entries(
        numberOfShipsTable
      )) {
        for (let n = 0; n < numberOfShips; n++) {
          gameBoard = this.#getGameBoardWithNewShip(shipType, gameBoard);
        }
      }
      gameBoard = new GameBoard(
        boardWidth,
        boardHeight,
        "initial",
        gameBoard.ships,
        gameBoard.hits
      );
    }

    return gameBoard;
  }

  canPlaceShip(gameBoard, { type, location, direction, throws = false }) {
    const ship = this.#shipFactory.create(type, location, direction);
    const isShipWithinBounds = gameBoard.isShipWithinBounds(ship);
    if (throws && !isShipWithinBounds) {
      throw new RangeError("placed ship out of bounds");
    }
    const isShipAvoidingCollision = !gameBoard.detectCollision(ship);
    if (throws && !isShipAvoidingCollision) {
      throw new RangeError(
        "can't place here: placed ship collided with an existing one"
      );
    }
    const canAddAnotherShipForType = !this.#isNumberOfShipsByTypeFull(
      type,
      gameBoard
    );
    if (throws && !canAddAnotherShipForType) {
      throw new RangeError(`the game already has enough ships of type ${type}`);
    }
    return (
      isShipWithinBounds && isShipAvoidingCollision && canAddAnotherShipForType
    );
  }

  placeShip(gameBoard, { type, location, direction }) {
    let newGameBoard;
    if (
      this.canPlaceShip(gameBoard, { type, location, direction, throws: true })
    ) {
      const newShip = this.#shipFactory.create(type, location, direction);
      newGameBoard = gameBoard.add(newShip);
      const allShipsOnBoard = this.#isNumberOfShipsFull(newGameBoard);
      if (allShipsOnBoard) {
        newGameBoard = new GameBoard(
          boardWidth,
          boardHeight,
          "initial",
          gameBoard.ships,
          gameBoard.hits
        );
      }
    }
    return newGameBoard;
  }

  getNumberOfShipsInfo() {
    return numberOfShipsTable;
  }

  #isNumberOfShipsByTypeFull(type, gameBoard) {
    const allowedNumberOfShips = numberOfShipsTable[type];
    const shipLength = this.#shipFactory.getShipSizeInfo()[type].length;
    const numberOfShipsAdded = gameBoard.ships.reduce(
      (acc, cur) => acc + (cur.positions.length === shipLength ? 1 : 0),
      0
    );
    return numberOfShipsAdded === allowedNumberOfShips;
  }

  #isNumberOfShipsFull(gameBoard) {
    for (const type of Object.keys(numberOfShipsTable)) {
      if (!this.#isNumberOfShipsByTypeFull(type, gameBoard)) {
        return false;
      }
    }
    return true;
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
