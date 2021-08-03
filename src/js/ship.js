import isEqual from "lodash/isEqual";

function validateConnectedPositions(shipPositions) {
  function isNorthFacing(positions) {
    const [startX, startY] = positions[0];
    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      if (x !== startX || y !== startY - i) {
        return false;
      }
    }
    return true;
  }

  function isSouthFacing(positions) {
    const [startX, startY] = positions[0];
    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      if (x !== startX || y !== startY + i) {
        return false;
      }
    }
    return true;
  }

  function isEastFacing(positions) {
    const [startX, startY] = positions[0];
    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      if (x !== startX + i || y !== startY) {
        return false;
      }
    }
    return true;
  }

  function isWestFacing(positions) {
    const [startX, startY] = positions[0];
    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      if (x !== startX - i || y !== startY) {
        return false;
      }
    }
    return true;
  }
  if (!Array.isArray(shipPositions) || shipPositions.length === 0) {
    throw new TypeError("must give a valid ship positions array");
  }
  if (
    !(
      isNorthFacing(shipPositions) ||
      isSouthFacing(shipPositions) ||
      isEastFacing(shipPositions) ||
      isWestFacing(shipPositions)
    )
  ) {
    throw new RangeError("ship position coordinated must form a sound line");
  }
}

class Ship {
  #positions;
  #hits;

  constructor(positions) {
    validateConnectedPositions(positions);
    this.#positions = positions;
    this.#hits = [];
  }

  hit([x, y]) {
    this.#validateHit([x, y]);
    if (!this.#isExistingHit([x, y])) {
      this.#hits.push([x, y]);
    }
  }

  getHits() {
    return this.#hits;
  }

  isSunk() {
    return isEqual(this.#positions.sort(), this.#hits.sort());
  }

  #isPosition([x, y]) {
    return !!this.#positions.find((position) => isEqual(position, [x, y]));
  }

  #isExistingHit([x, y]) {
    return !!this.#hits.find((hit) => isEqual(hit, [x, y]));
  }

  #validateHit([x, y]) {
    if (!this.#isPosition([x, y])) {
      throw new RangeError("hit coordinates outside of ship");
    }
  }
}

export default Ship;
