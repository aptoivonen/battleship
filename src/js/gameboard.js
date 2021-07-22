import Ship from "./ship";

function isWithinBounds([x, y], gameBoard) {
  return x >= 0 && x < gameBoard.width && y >= 0 && y < gameBoard.height;
}

function findHit([x, y], gameBoard) {
  return gameBoard.hits.find(([hitX, hitY]) => hitX === x && hitY === y);
}

function findShipAndIndex([x, y], gameBoard) {
  for (const shipLoc of gameBoard.shipLocations) {
    for (let i = 0; i < shipLoc.ship.length; i++) {
      const [shipX, shipY] = shipLoc.shipMappingFunction(i);
      if (shipX === x && shipY === y) {
        return { ship: shipLoc.ship, index: i };
      }
    }
  }
  return null;
}

function findShip([x, y], gameBoard) {
  const shipLocation = findShipAndIndex([x, y], gameBoard);
  if (shipLocation) {
    return shipLocation.ship;
  }
  return null;
}

function isShipLocationWithinBounds(shipLocation, gameBoard) {
  for (let i = 0; i < shipLocation.ship.length; i++) {
    const [x, y] = shipLocation.shipMappingFunction(i);
    if (!isWithinBounds([x, y], gameBoard)) {
      return false;
    }
  }
  return true;
}

class GameBoard {
  constructor(
    width,
    height,
    status = "initial",
    shipLocations = [],
    hits = []
  ) {
    this.width = width;
    this.height = height;
    this.status = status;
    this.shipLocations = shipLocations;
    this.hits = hits;
  }

  add({ ship, location, shipMappingFunction }) {
    if (!ship || !(ship instanceof Ship)) {
      throw new TypeError("ship is missing or is not instance of Ship");
    }
    if (!shipMappingFunction || typeof shipMappingFunction !== "function") {
      throw new TypeError(
        "shipMappingFunction is missing or is not a function"
      );
    }
    const newShipLocation = { ship, location, shipMappingFunction };
    if (!isShipLocationWithinBounds(newShipLocation, this)) {
      throw new RangeError("ship dimensions out of bounds");
    }
    this.shipLocations.push(newShipLocation);
    return this;
  }

  receiveAttack([x, y]) {
    if (!isWithinBounds([x, y], this)) {
      throw new RangeError("board coordinates out of bound");
    }
    if (findHit([x, y], this)) {
      return this;
    }
    const newHits = [...this.hits, [x, y]];
    // default new status
    let newStatus = "running";
    const shipAndIndex = findShipAndIndex([x, y], this);
    if (shipAndIndex) {
      shipAndIndex.ship.hit(shipAndIndex.index);
    }
    if (this.shipLocations.every((shipLoc) => shipLoc.ship.isSunk())) {
      newStatus = "lost";
    }
    return new GameBoard(
      this.width,
      this.height,
      newStatus,
      this.shipLocations,
      newHits
    );
  }

  /* 
    . : empty
    s : ship (non-hit portion)
    x : miss (in the water)
    X : hit (on a ship)
  */
  getBoard() {
    let result = "";
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        let char;
        const hit = findHit([column, row], this);
        const ship = findShip([column, row], this);
        if (hit && ship) {
          char = "X";
        } else if (hit) {
          char = "x";
        } else if (ship) {
          char = "s";
        } else {
          char = ".";
        }
        result += char;
      }
    }
    return result;
  }

  /* 
    Statuses: 'initial', 'running', and 'lost'
  */
  getStatus() {
    return this.status;
  }
}

export default GameBoard;
