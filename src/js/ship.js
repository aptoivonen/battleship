class Ship {
  constructor(length) {
    this.hits = new Array(length).fill(false);
  }

  get length() {
    return this.hits.length;
  }

  hit(position) {
    if (position >= 0 && position < this.length) {
      this.hits[position] = true;
    }
  }

  isSunk() {
    return this.hits.every((hit) => hit);
  }
}

export default Ship;
