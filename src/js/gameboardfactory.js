import GameBoard from "./gameboard";
import numberOfShipsTable from "./numberofshipstable";

const types = {
  player: GameBoard,
  ai: GameBoard,
};
Object.setPrototypeOf(types, null);

const shipMappingFunctions = [
  function horizontalShipMapFn(shipIndex) {
    const [x, y] = this.location;
    return [x + shipIndex, y];
  },
  function verticalShipMapFn(shipIndex) {
    const [x, y] = this.location;
    return [x, y - shipIndex];
  },
];

const shipsToCreate = {
  carrier: "carrier" in numberOfShipsTable ? numberOfShipsTable["carrier"] : 1,
  battleship:
    "battleship" in numberOfShipsTable ? numberOfShipsTable["battleship"] : 2,
  cruiser: "cruiser" in numberOfShipsTable ? numberOfShipsTable["cruiser"] : 3,
  destroyer:
    "destroyer" in numberOfShipsTable ? numberOfShipsTable["destroyer"] : 4,
  submarine:
    "submarine" in numberOfShipsTable ? numberOfShipsTable["submarine"] : 5,
};
Object.setPrototypeOf(shipsToCreate, null);

function getRandomShipMappingFunction(random) {
  const randomIndex = Math.floor(2 * random());
  return shipMappingFunctions[randomIndex];
}

function getRandomSquare(gameBoard, random) {
  const x = Math.floor(random() * gameBoard.width);
  const y = Math.floor(random() * gameBoard.height);
  return [x, y];
}
class GameBoardFactory {
  constructor(shipFactory, randomizeFn) {
    if (arguments.length < 2) {
      throw new TypeError(
        "cannot create a gameBoardFactory: too few arguments; 2 are required"
      );
    }
    this.shipFactory = shipFactory;
    this.random = randomizeFn;
  }

  create(type) {
    if (!this.shipFactory) {
      throw new TypeError(
        "cannot create a gameBoard: shipFactory instance is not set"
      );
    }
    const GameBoardClass = types[type];
    if (!GameBoardClass) {
      throw new TypeError("no such player type");
    }
    let gameBoard = new GameBoardClass(10, 10);
    for (const [shipType, numberOfShips] of Object.entries(shipsToCreate)) {
      for (let n = 0; n < numberOfShips; n++) {
        gameBoard = this.#getGameBoardWithNewShipLocation(shipType, gameBoard);
      }
    }

    return gameBoard;
  }

  #getGameBoardWithNewShipLocation(shipType, gameBoard) {
    const ship = this.shipFactory.create(shipType);
    let newGameBoard;
    let newShipLocation;
    let continueIteration = true;
    do {
      const randomSquare = getRandomSquare(gameBoard, this.random);
      const randomShipMappingFn = getRandomShipMappingFunction(this.random);
      newShipLocation = {
        ship,
        location: randomSquare,
        shipMappingFunction: randomShipMappingFn,
      };
      try {
        newGameBoard = gameBoard.add(newShipLocation);
        continueIteration = false;
        // eslint-disable-next-line no-empty
      } catch (RangeError) {}
    } while (continueIteration);
    return newGameBoard;
  }
}

export default GameBoardFactory;
