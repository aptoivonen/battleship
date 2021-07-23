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

function getRandomShipMappingFunction() {
  const randomIndex = Math.floor(2 * Math.random());
  return shipMappingFunctions[randomIndex];
}

function getRandomSquare(gameBoard) {
  const x = Math.floor(Math.random() * gameBoard.width);
  const y = Math.floor(Math.random() * gameBoard.height);
  return [x, y];
}

class GameBoardFactory {
  constructor(shipFactory) {
    this.shipFactory = shipFactory;
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
        const ship = this.shipFactory.create(shipType);
        let newShipLocation;
        do {
          const randomSquare = getRandomSquare(gameBoard);
          const randomShipMappingFn = getRandomShipMappingFunction();
          newShipLocation = {
            ship,
            location: randomSquare,
            shipMappingFunction: randomShipMappingFn,
          };
        } while (
          gameBoard.detectCollision(newShipLocation) ||
          !gameBoard.isShipLocationWithinBounds(newShipLocation)
        );
        gameBoard = gameBoard.add(newShipLocation);
      }
    }

    return gameBoard;
  }
}

export default GameBoardFactory;
