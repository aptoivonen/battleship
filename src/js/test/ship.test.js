import Ship from "../ship";

let ship;
beforeEach(() => {
  ship = new Ship([
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});

describe("constructor", () => {
  test("create a ship with legal positions", () => {
    expect(() => {
      new Ship([
        [0, 0],
        [1, 0],
      ]);
    }).not.toThrow(RangeError);
  });

  test("ship with no positions throws TypeError", () => {
    expect(() => {
      new Ship([]);
    }).toThrow(new TypeError("must give a valid ship positions array"));
  });

  test("ship with positions not in a line throws RangeError", () => {
    expect(() => {
      new Ship([
        [0, 0],
        [1, 1],
      ]);
    }).toThrow(
      new RangeError("ship position coordinated must form a sound line")
    );
  });
});

describe("hit", () => {
  test("a correct hit does not throw Error", () => {
    expect(() => {
      ship.hit([0, 0]);
    }).not.toThrow();
  });

  test("an outside hit throws RangeError", () => {
    expect(() => {
      ship.hit([1, 1]);
    }).toThrow(new RangeError("hit coordinates outside of ship"));
  });
});

describe("hits getter", () => {
  test("a hit is registered properly", () => {
    ship.hit([0, 0]);
    expect(ship.hits).toEqual([[0, 0]]);
  });

  test("hits in the same place are not registered", () => {
    ship.hit([0, 0]);
    ship.hit([0, 0]);
    ship.hit([0, 0]);
    expect(ship.hits).toEqual([[0, 0]]);
  });
});

describe("positions getter", () => {
  test("ship has correct number of positions", () => {
    expect(ship.positions).toHaveLength(3);
  });
});

describe("isSunk", () => {
  test("ship does not start the game sunk", () => {
    const result = ship.isSunk();
    expect(result).toEqual(expect.any(Boolean));
    expect(result).toBe(false);
  });

  test("ship is sunk after correct hits", () => {
    ship.hit([0, 0]);
    ship.hit([0, 1]);
    ship.hit([0, 2]);
    const result = ship.isSunk();
    expect(result).toEqual(expect.any(Boolean));
    expect(result).toBe(true);
  });

  test("ship is not sunk after too few hits", () => {
    ship.hit([0, 0]);
    ship.hit([0, 1]);
    const result = ship.isSunk();
    expect(result).toEqual(expect.any(Boolean));
    expect(result).toBe(false);
  });

  test("ship is not sunk after hits in the same place", () => {
    ship.hit([0, 0]);
    ship.hit([0, 0]);
    ship.hit([0, 0]);
    const result = ship.isSunk();
    expect(result).toEqual(expect.any(Boolean));
    expect(result).toBe(false);
  });
});
