function findHit([x, y], gameBoard) {
  return gameBoard.hits.find(([hitX, hitY]) => hitX === x && hitY === y);
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

  receiveAttack([x, y]) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new RangeError("board coordinates out of bound");
    }
    if (findHit([x, y], this)) {
      return this;
    }
    const newHits = [...this.hits, [x, y]];
    return new GameBoard(
      this.width,
      this.height,
      "running",
      this.shipLocations,
      newHits
    );
  }

  getBoard() {
    let result = "";
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        let char;
        if (findHit([column, row], this)) {
          char = "x";
        } else {
          char = ".";
        }
        result += char;
      }
    }
    return result;
  }
}

export default GameBoard;
