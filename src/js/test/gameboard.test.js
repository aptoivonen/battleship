import isEqual from "lodash/isEqual";
import GameBoard from "../gameboard";
import ShipFactory from "../shipfactory";

const shipFactory = new ShipFactory();

describe("width and height getters", () => {
  test("board is of correct size", () => {
    const board = new GameBoard(5, 7);
    expect(board.width).toBe(5);
    expect(board.height).toBe(7);
  });
});

describe("add method", () => {
  const eastwardsCruiser = shipFactory.create("cruiser", [0, 0], "eastwards");
  const southwardsCruiser = shipFactory.create("cruiser", [0, 1], "southwards");

  test("returns a GameBoard object", () => {
    const board = new GameBoard(10, 10).add(eastwardsCruiser);
    expect(board).toEqual(expect.any(GameBoard));
  });

  test("throws TypeError if ship was missing", () => {
    expect(() => {
      new GameBoard(10, 10).add();
    }).toThrow(new TypeError("ship is missing"));
  });

  test("throw Error if adding ship after game is no longer in 'placement' state", () => {
    expect(() => {
      new GameBoard(10, 10, "initial").add(eastwardsCruiser);
    }).toThrow(new Error("can't add ships after game has started"));
  });

  test("adding one ship within bounds", () => {
    const board = new GameBoard(10, 10).add(eastwardsCruiser);
    expect(board.ships).toHaveLength(1);
  });

  test("adding multiple ships within bounds", () => {
    const board = new GameBoard(10, 10)
      .add(eastwardsCruiser)
      .add(southwardsCruiser);
    expect(board.ships).toHaveLength(2);
  });

  test("adding one ship out-of-bounds", () => {
    expect(() => {
      const outShip = shipFactory.create("cruiser", [0, 0], "westwards");
      new GameBoard(10, 10).add(outShip);
    }).toThrow(new RangeError("ship dimensions out of bounds"));
  });

  test("two ships colliding throws RangeError", () => {
    expect(() => {
      const collidingWestwardsCruiser = shipFactory.create(
        "cruiser",
        [2, 0],
        "westwards"
      );
      new GameBoard(10, 10)
        .add(eastwardsCruiser)
        .add(collidingWestwardsCruiser);
    }).toThrow(new RangeError("added ship collided with another ship"));
  });
});

describe("receiveAttack method", () => {
  test("returns a gameBoard object", () => {
    const board = new GameBoard(10, 10, "initial");
    const newBoard = board.receiveAttack([1, 2]);
    expect(newBoard).toEqual(expect.any(GameBoard));
  });

  test("out-of-bounds values throw RangeError", () => {
    const board = new GameBoard(10, 10, "initial");
    expect(() => {
      board.receiveAttack([11, 12]);
    }).toThrow(RangeError);
    expect(() => {
      board.receiveAttack([11, 12]);
    }).toThrow("board coordinates out of bound");
  });

  test("not receiving an array throws TypeError", () => {
    const board = new GameBoard(10, 10, "initial");
    expect(() => {
      board.receiveAttack(1, 2);
    }).toThrow(TypeError);
  });

  test("attacking a board in 'placement' throws Error", () => {
    const board = new GameBoard(10, 10);
    expect(() => {
      board.receiveAttack([1, 2]);
    }).toThrow("can't attack board in 'placement' status");
  });

  test("attacking is registered in hits", () => {
    const board = new GameBoard(10, 10, "initial").receiveAttack([1, 2]);
    expect(isEqual(board.hits, [[1, 2]])).toBe(true);
  });

  test("same coordinates twice returns the same gameBoard object", () => {
    const board1 = new GameBoard(10, 10, "initial");
    const board2 = board1.receiveAttack([1, 2]);
    const board3 = board2.receiveAttack([1, 2]);
    expect(board2).toBe(board3);
  });

  test("different coordinates produce different gameBoard objects", () => {
    const board1 = new GameBoard(10, 10, "initial");
    const board2 = board1.receiveAttack([1, 2]);
    const board3 = board2.receiveAttack([3, 3]);
    expect(board2).not.toBe(board3);
  });

  test("board has hits after legal attacks", () => {
    const board = new GameBoard(10, 10, "initial")
      .receiveAttack([0, 0])
      .receiveAttack([0, 1]);
    expect(
      isEqual(
        board.hits.sort(),
        [
          [0, 0],
          [0, 1],
        ].sort()
      )
    ).toBe(true);
  });

  test("attacking same coordinates twice is registered as one hit", () => {
    const board = new GameBoard(10, 10, "initial")
      .receiveAttack([1, 2])
      .receiveAttack([1, 2]);
    expect(isEqual(board.hits.sort(), [[1, 2]].sort())).toBe(true);
  });
});

describe("receiveAttack with ships on the board", () => {
  const eastwardsCruiser = shipFactory.create("cruiser", [0, 0], "eastwards");

  test("add a ship, then attack it twice and miss once", () => {
    const board0 = new GameBoard(10, 10).add(eastwardsCruiser);
    const board1 = new GameBoard(10, 10, "initial", board0.ships, board0.hit);
    const board2 = board1.receiveAttack([0, 0]);
    const board3 = board2.receiveAttack([1, 0]);
    const board4 = board3.receiveAttack([0, 1]);
    expect(board2.hits).toHaveLength(1);
    expect(board3.hits).toHaveLength(2);
    expect(board4.hits).toHaveLength(3);
    expect(board2.ships[0].hits).toHaveLength(1);
    expect(isEqual(board2.ships[0].hits.sort(), [[0, 0]])).toBe(true);
    expect(board3.ships[0].hits).toHaveLength(2);
    expect(
      isEqual(board3.ships[0].hits.sort(), [
        [0, 0],
        [1, 0],
      ])
    ).toBe(true);
    expect(board4.ships[0].hits).toHaveLength(2);
    expect(
      isEqual(board4.ships[0].hits.sort(), [
        [0, 0],
        [1, 0],
      ])
    ).toBe(true);
  });
});

describe("isShipWithinBounds", () => {
  test("ship within bounds returns true", () => {
    const eastwardsCruiser = shipFactory.create("cruiser", [0, 0], "eastwards");
    const result = new GameBoard(10, 10).isShipWithinBounds(eastwardsCruiser);
    expect(result).toBe(true);
  });

  test("ship out of bounds returns false", () => {
    const outShip = shipFactory.create("cruiser", [0, 0], "westwards");
    const result = new GameBoard(10, 10).isShipWithinBounds(outShip);
    expect(result).toBe(false);
  });
});

describe("detectCollision", () => {
  test("two ships colliding returns true", () => {
    const eastwardsCruiser = shipFactory.create("cruiser", [0, 0], "eastwards");
    const collidingWestwardsCruiser = shipFactory.create(
      "cruiser",
      [2, 0],
      "westwards"
    );
    const gameBoard = new GameBoard(10, 10).add(eastwardsCruiser);
    const result = gameBoard.detectCollision(collidingWestwardsCruiser);
    expect(result).toBe(true);
  });
});

describe("getStatus", () => {
  const eastwardsCruiser = shipFactory.create("cruiser", [0, 0], "eastwards");
  const southwardsCruiser = shipFactory.create("cruiser", [0, 1], "southwards");

  test("a new empty board has status 'placement'", () => {
    const board = new GameBoard(5, 7);
    expect(board.getStatus()).toBe("placement");
  });

  test("a new board with some ships has status 'placement'", () => {
    const board = new GameBoard(10, 10)
      .add(eastwardsCruiser)
      .add(southwardsCruiser);
    expect(board.getStatus()).toBe("placement");
  });

  test("a board has status 'running' after one call to receiveAttack", () => {
    const board = new GameBoard(10, 10).add(eastwardsCruiser);
    const board1 = new GameBoard(
      10,
      10,
      "initial",
      board.ships,
      board.hits
    ).receiveAttack([0, 0]);
    expect(board1.getStatus()).toBe("running");
  });

  test("a board has status 'lost' after only ship is sunk", () => {
    const board = new GameBoard(10, 10).add(eastwardsCruiser);
    const board1 = new GameBoard(10, 10, "initial", board.ships, board.hits)
      .receiveAttack([0, 0])
      .receiveAttack([1, 0])
      .receiveAttack([2, 0]);
    expect(board1.getStatus()).toBe("lost");
  });

  test("a board with multiple ships all sunk has status 'lost'", () => {
    const board = new GameBoard(10, 10)
      .add(eastwardsCruiser)
      .add(southwardsCruiser);
    const board1 = new GameBoard(10, 10, "initial", board.ships, board.hits)
      .receiveAttack([0, 0])
      .receiveAttack([1, 0])
      .receiveAttack([2, 0])
      .receiveAttack([0, 1])
      .receiveAttack([0, 2])
      .receiveAttack([0, 3]);
    expect(board1.getStatus()).toBe("lost");
  });

  test("a board with status 'lost' returns itself after another attack", () => {
    const board = new GameBoard(10, 10).add(eastwardsCruiser);
    const board1 = new GameBoard(10, 10, "initial", board.ships, board.hits)
      .receiveAttack([0, 0])
      .receiveAttack([1, 0])
      .receiveAttack([2, 0]);
    expect(board1.getStatus()).toBe("lost");
    const board2 = board1.receiveAttack([3, 0]);
    expect(board2).toBe(board1);
    const board3 = board2.receiveAttack([4, 0]);
    expect(board3).toBe(board1);
  });
});
