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

  test("a correct hit returns a ship object", () => {
    const newShip = ship.hit([0, 0]);
    expect(newShip).toEqual(expect.any(Ship));
  });
});

describe("hits getter", () => {
  test("a hit is registered properly", () => {
    const newShip = ship.hit([0, 0]);
    expect(newShip.hits).toEqual([[0, 0]]);
  });

  test("hits in the same place are not registered", () => {
    const newShip = ship.hit([0, 0]).hit([0, 0]).hit([0, 0]);
    expect(newShip.hits).toEqual([[0, 0]]);
  });
});

describe("positions getter", () => {
  test("ship has correct number of positions", () => {
    expect(ship.positions).toHaveLength(3);
  });
});

describe("hasPosition", () => {
  test("ship has position", () => {
    expect(ship.hasPosition([0, 0])).toBe(true);
  });

  test("ship doesn't have nonexistent position", () => {
    expect(ship.hasPosition([9, 9])).toBe(false);
  });
});

describe("isSunk", () => {
  test("ship does not start the game sunk", () => {
    const result = ship.isSunk();
    expect(result).toBe(false);
  });

  test("ship is sunk after correct hits", () => {
    const newShip = ship.hit([0, 0]).hit([0, 1]).hit([0, 2]);
    const result = newShip.isSunk();
    expect(result).toBe(true);
  });

  test("ship is not sunk after too few hits", () => {
    const newShip = ship.hit([0, 0]).hit([0, 1]);
    const result = newShip.isSunk();
    expect(result).toBe(false);
  });

  test("ship is not sunk after hits in the same place", () => {
    const newShip = ship.hit([0, 0]).hit([0, 0]).hit([0, 0]);
    const result = newShip.isSunk();
    expect(result).toBe(false);
  });
});
