class GameBoard {
  #width;
  #height;
  #status;
  #ships;
  #hits;

  constructor(width, height, status = "initial", ships = [], hits = []) {
    this.#width = width;
    this.#height = height;
    this.#status = status;
    this.#ships = ships;
    this.#hits = hits;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get ships() {
    return this.#ships;
  }

  get hits() {
    return this.#hits;
  }

  add(ship) {
    if (this.#status !== "initial") {
      throw new Error("can't add ships after game has started");
    }

    if (!ship) {
      throw new TypeError("ship is missing");
    }

    if (!this.#isShipWithinBounds(ship)) {
      throw new RangeError("ship dimensions out of bounds");
    }

    if (this.#detectCollision(ship)) {
      throw new RangeError("added ship collided with another ship");
    }

    this.#ships.push(ship);
    return this;
  }

  receiveAttack([x, y]) {
    if (!this.#isWithinBounds([x, y])) {
      throw new RangeError("board coordinates out of bound");
    }
    if (this.findHit([x, y]) || this.#status === "lost") {
      return this;
    }
    const newHits = [...this.#hits, [x, y]];

    let newShips = this.#ships;
    const shipWithPosition = this.#findShip([x, y]);
    if (shipWithPosition) {
      newShips = newShips.filter((ship) => ship !== shipWithPosition);
      const newHitShip = shipWithPosition.hit([x, y]);
      newShips.push(newHitShip);
    }

    // default new status
    let newStatus = "running";
    if (newShips.length > 0 && newShips.every((ship) => ship.isSunk())) {
      newStatus = "lost";
    }
    return new GameBoard(this.width, this.height, newStatus, newShips, newHits);
  }

  /* 
    Statuses: 'initial', 'running', and 'lost'
  */
  getStatus() {
    return this.#status;
  }

  #findShip([x, y]) {
    for (const ship of this.#ships) {
      if (ship.hasPosition([x, y])) {
        return ship;
      }
    }
    return null;
  }

  findHit([x, y]) {
    return this.#hits.find(([hitX, hitY]) => hitX === x && hitY === y);
  }

  #isWithinBounds([x, y]) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  #isShipWithinBounds(ship) {
    for (const position of ship.positions) {
      if (!this.#isWithinBounds(position)) {
        return false;
      }
    }
    return true;
  }

  #detectCollision(newShip) {
    for (const position of newShip.positions) {
      if (this.#findShip(position)) {
        return true;
      }
    }
    return false;
  }
}

export default GameBoard;
