import { expect } from "@jest/globals";
import GameBoard from "./gameboard";
import Ship from "./ship";

// A globally needed helper
function horizontalShipMapFn(shipIndex) {
  const [x, y] = this.location;
  return [x + shipIndex, y];
}

test("board is of correct size", () => {
  const board = new GameBoard(5, 7);
  expect(board.width).toBe(5);
  expect(board.height).toBe(7);
});

describe("receiveAttack method works correctly", () => {
  test("returns a gameBoard object", () => {
    const board = new GameBoard(10, 10);
    const newBoard = board.receiveAttack([1, 2]);
    expect(newBoard).toEqual(expect.any(GameBoard));
  });

  test("out-of-bounds values throw RangeError", () => {
    const board = new GameBoard(10, 10);
    expect(() => {
      board.receiveAttack([11, 12]);
    }).toThrow(RangeError);
    expect(() => {
      board.receiveAttack([11, 12]);
    }).toThrow("board coordinates out of bound");
  });

  test("not receiving an array throws TypeError", () => {
    const board = new GameBoard(10, 10);
    expect(() => {
      board.receiveAttack(1, 2);
    }).toThrow(TypeError);
  });
});

describe("getBoard method works correctly", () => {
  test("returns a string", () => {
    const boardString = new GameBoard(10, 10).getBoard();
    expect(boardString).toEqual(expect.any(String));
  });

  test("returns a string whose length is correct", () => {
    const boardString = new GameBoard(5, 7).getBoard();
    expect(boardString).toHaveLength(5 * 7);
  });

  test("initially returns all dots and s's", () => {
    const boardString = new GameBoard(10, 10).getBoard();
    const initialRegExp = /[.s]/;
    const filteredCharacterArray = boardString
      .split("")
      .filter((char) => initialRegExp.test(char));
    expect(filteredCharacterArray).toHaveLength(10 * 10);
  });
});

describe("getBoard and receiveAttack work correctly together", () => {
  test("same coordinates twice returns the same gameBoard object", () => {
    const board1 = new GameBoard(10, 10);
    const board2 = board1.receiveAttack([1, 2]);
    const board3 = board2.receiveAttack([1, 2]);
    expect(board2.getBoard()).toBe(board3.getBoard());
  });

  test("different coordinates produce different gameBoard objects", () => {
    const board1 = new GameBoard(10, 10);
    const board2 = board1.receiveAttack([1, 2]);
    const board3 = board2.receiveAttack([3, 3]);
    expect(board2.getBoard()).not.toBe(board3.getBoard());
  });

  test("correctly shows one miss and all others dots/ships after one receiveAttack", () => {
    const board = new GameBoard(10, 10).receiveAttack([2, 1]);
    const boardArray = board.getBoard().split("");
    expect(boardArray[12]).toBe("x");
    // dot or 's'
    const initialRegExp = /[.s]/;
    const filteredCharacterArray = boardArray.filter((char) =>
      initialRegExp.test(char)
    );
    expect(filteredCharacterArray).toHaveLength(10 * 10 - 1);
    const missesOnlyArray = boardArray.filter((char) => char === "x");
    expect(missesOnlyArray).toHaveLength(1);
  });
});

describe("add method works properly", () => {
  test("returns a GameBoard object", () => {
    const board = new GameBoard(10, 10).add({
      ship: new Ship(1),
      location: [0, 0],
      shipMappingFunction: horizontalShipMapFn,
    });
    expect(board).toEqual(expect.any(GameBoard));
  });

  test("throws TypeError if ship was of wrong type or missing", () => {
    expect(() => {
      new GameBoard(10, 10).add({
        location: [0, 0],
        shipMappingFunction: horizontalShipMapFn,
      });
    }).toThrow(TypeError);
    expect(() => {
      new GameBoard(10, 10).add({
        location: [0, 0],
        shipMappingFunction: horizontalShipMapFn,
      });
    }).toThrow("ship is missing or is not instance of Ship");
  });

  test("throws TypeError if shipMappingFunction was of wrong type or missing", () => {
    expect(() => {
      new GameBoard(10, 10).add({
        ship: new Ship(1),
        location: [0, 0],
      });
    }).toThrow(TypeError);
    expect(() => {
      new GameBoard(10, 10).add({
        ship: new Ship(1),
        location: [0, 0],
      });
    }).toThrow("shipMappingFunction is missing or is not a function");
  });

  test("adding one ship within bounds", () => {
    const board = new GameBoard(10, 10).add({
      ship: new Ship(1),
      location: [0, 0],
      shipMappingFunction: horizontalShipMapFn,
    });
    const boardArray = board.getBoard().split("");
    expect(boardArray[0]).toBe("s");
    const shipsOnlyArray = boardArray.filter((char) => char === "s");
    expect(shipsOnlyArray).toHaveLength(1);
    const emptiesOnlyArray = boardArray.filter((char) => char === ".");
    expect(emptiesOnlyArray).toHaveLength(10 * 10 - 1);
  });

  test("adding multiple ships within bounds", () => {
    const board = new GameBoard(10, 10)
      .add({
        ship: new Ship(1),
        location: [0, 0],
        shipMappingFunction: horizontalShipMapFn,
      })
      .add({
        ship: new Ship(2),
        location: [5, 1],
        shipMappingFunction: horizontalShipMapFn,
      })
      .add({
        ship: new Ship(3),
        location: [7, 2],
        shipMappingFunction: horizontalShipMapFn,
      });
    const boardArray = board.getBoard().split("");
    expect(boardArray[0]).toBe("s");
    expect(boardArray[15]).toBe("s");
    expect(boardArray[16]).toBe("s");
    expect(boardArray[27]).toBe("s");
    expect(boardArray[28]).toBe("s");
    expect(boardArray[29]).toBe("s");
    const shipsOnlyArray = boardArray.filter((char) => char === "s");
    expect(shipsOnlyArray).toHaveLength(6);
    const emptiesOnlyArray = boardArray.filter((char) => char === ".");
    expect(emptiesOnlyArray).toHaveLength(10 * 10 - 6);
  });

  test("adding one ship out-of-bounds", () => {
    expect(() => {
      new GameBoard(10, 10).add({
        ship: new Ship(3),
        location: [9, 0],
        shipMappingFunction: horizontalShipMapFn,
      });
    }).toThrow(RangeError);
    expect(() => {
      new GameBoard(10, 10).add({
        ship: new Ship(3),
        location: [9, 0],
        shipMappingFunction: horizontalShipMapFn,
      });
    }).toThrow("ship dimensions out of bounds");
  });

  test("two ships colliding throws RangeError", () => {
    expect(() => {
      new GameBoard(10, 10)
        .add({
          ship: new Ship(3),
          location: [0, 0],
          shipMappingFunction: horizontalShipMapFn,
        })
        .add({
          ship: new Ship(2),
          location: [2, 0],
          shipMappingFunction: horizontalShipMapFn,
        });
    }).toThrow(RangeError);
    expect(() => {
      new GameBoard(10, 10)
        .add({
          ship: new Ship(3),
          location: [0, 0],
          shipMappingFunction: horizontalShipMapFn,
        })
        .add({
          ship: new Ship(2),
          location: [2, 0],
          shipMappingFunction: horizontalShipMapFn,
        });
    }).toThrow("added ship collided with another ship");
  });
});

describe("add, receiveAttack, and getBoard work correctly together", () => {
  test("adding a ship, then attack it twice and miss once", () => {
    const board1 = new GameBoard(10, 10).add({
      ship: new Ship(3),
      location: [0, 0],
      shipMappingFunction: horizontalShipMapFn,
    });
    const board2 = board1.receiveAttack([0, 0]);
    const board3 = board2.receiveAttack([1, 0]);
    const board4 = board3.receiveAttack([0, 1]);
    const boardArray = board4.getBoard().split("");
    expect(boardArray[0]).toBe("X");
    expect(boardArray[1]).toBe("X");
    expect(boardArray[2]).toBe("s");
    expect(boardArray[10]).toBe("x");
    const hitsOnlyArray = boardArray.filter((char) => char === "X");
    expect(hitsOnlyArray).toHaveLength(2);
    const shipsOnlyArray = boardArray.filter((char) => char === "s");
    expect(shipsOnlyArray).toHaveLength(1);
    const missesOnlyArray = boardArray.filter((char) => char === "x");
    expect(missesOnlyArray).toHaveLength(1);
    const emptiesOnlyArray = boardArray.filter((char) => char === ".");
    expect(emptiesOnlyArray).toHaveLength(10 * 10 - 4);
  });
});

describe("getStatus works correctly", () => {
  test("a new empty board has status 'initial'", () => {
    const board = new GameBoard(5, 7);
    expect(board.getStatus()).toBe("initial");
  });

  test("a new board with multiple ships has status 'initial'", () => {
    const board = new GameBoard(10, 10)
      .add({
        ship: new Ship(1),
        location: [0, 0],
        shipMappingFunction: horizontalShipMapFn,
      })
      .add({
        ship: new Ship(2),
        location: [5, 1],
        shipMappingFunction: horizontalShipMapFn,
      })
      .add({
        ship: new Ship(3),
        location: [7, 2],
        shipMappingFunction: horizontalShipMapFn,
      });
    expect(board.getStatus()).toBe("initial");
  });

  test("a board has status 'running' after one call to receiveAttack", () => {
    const board = new GameBoard(10, 10)
      .add({
        ship: new Ship(2),
        location: [0, 0],
        shipMappingFunction: horizontalShipMapFn,
      })
      .receiveAttack([0, 0]);
    expect(board.getStatus()).toBe("running");
  });

  test("a board with multiple ships all sunk has status 'lost'", () => {
    const board = new GameBoard(10, 10)
      .add({
        ship: new Ship(1),
        location: [0, 0],
        shipMappingFunction: horizontalShipMapFn,
      })
      .add({
        ship: new Ship(2),
        location: [5, 1],
        shipMappingFunction: horizontalShipMapFn,
      })
      .add({
        ship: new Ship(3),
        location: [7, 2],
        shipMappingFunction: horizontalShipMapFn,
      })
      .receiveAttack([0, 0])
      .receiveAttack([5, 1])
      .receiveAttack([6, 1])
      .receiveAttack([7, 2])
      .receiveAttack([8, 2])
      .receiveAttack([9, 2]);
    expect(board.getStatus()).toBe("lost");
  });
});
