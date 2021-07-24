import Ship from "./ship";

class GameBoard {
  #width;
  #height;
  #status;
  #shipLocations;
  #hits;

  constructor(
    width,
    height,
    status = "initial",
    shipLocations = [],
    hits = []
  ) {
    this.#width = width;
    this.#height = height;
    this.#status = status;
    this.#shipLocations = shipLocations;
    this.#hits = hits;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
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
    if (this.detectCollision(newShipLocation)) {
      throw new RangeError("added ship collided with another ship");
    }
    if (!this.isShipLocationWithinBounds(newShipLocation)) {
      throw new RangeError("ship dimensions out of bounds");
    }
    this.#shipLocations.push(newShipLocation);
    return this;
  }

  receiveAttack([x, y]) {
    if (!this.#isWithinBounds([x, y])) {
      throw new RangeError("board coordinates out of bound");
    }
    if (this.#findHit([x, y])) {
      return this;
    }
    const newHits = [...this.#hits, [x, y]];
    // default new status
    let newStatus = "running";
    const shipAndIndex = this.#findShipAndIndex([x, y]);
    if (shipAndIndex) {
      shipAndIndex.ship.hit(shipAndIndex.index);
    }
    if (this.#shipLocations.every((shipLoc) => shipLoc.ship.isSunk())) {
      newStatus = "lost";
    }
    return new GameBoard(
      this.width,
      this.height,
      newStatus,
      this.#shipLocations,
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
        const hit = this.#findHit([column, row]);
        const ship = this.#findShip([column, row]);
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
    return this.#status;
  }

  detectCollision(shipLocation) {
    for (let i = 0; i < shipLocation.ship.length; i++) {
      const [x, y] = shipLocation.shipMappingFunction(i);
      if (this.#findShip([x, y])) {
        return true;
      }
    }
    return false;
  }

  isShipLocationWithinBounds(shipLocation) {
    for (let i = 0; i < shipLocation.ship.length; i++) {
      const [x, y] = shipLocation.shipMappingFunction(i);
      if (!this.#isWithinBounds([x, y])) {
        return false;
      }
    }
    return true;
  }

  #findShip([x, y]) {
    return this.#findShipAndIndex([x, y])?.ship;
  }

  #findShipAndIndex([x, y]) {
    for (const shipLoc of this.#shipLocations) {
      for (let i = 0; i < shipLoc.ship.length; i++) {
        const [shipX, shipY] = shipLoc.shipMappingFunction(i);
        if (shipX === x && shipY === y) {
          return { ship: shipLoc.ship, index: i };
        }
      }
    }
    return null;
  }

  #findHit([x, y]) {
    return this.#hits.find(([hitX, hitY]) => hitX === x && hitY === y);
  }

  #isWithinBounds([x, y]) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}

export default GameBoard;
