import Game from "../game";
import { makeRandomMock, makeArraySampleMock } from "./testutils";

let randomMock;
let arraySampleMock;

beforeEach(() => {
  randomMock = makeRandomMock();
  arraySampleMock = makeArraySampleMock();
});

let fullyPlacedGame;

beforeEach(() => {
  fullyPlacedGame = new Game(randomMock, arraySampleMock)
    .placeShip({
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    })
    .placeShip({
      type: "battleship",
      location: [0, 1],
      direction: "eastwards",
    })
    .placeShip({
      type: "battleship",
      location: [4, 1],
      direction: "eastwards",
    })
    .placeShip({
      type: "cruiser",
      location: [0, 2],
      direction: "eastwards",
    })
    .placeShip({
      type: "cruiser",
      location: [3, 2],
      direction: "eastwards",
    })
    .placeShip({
      type: "cruiser",
      location: [6, 2],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [0, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [2, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [4, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "destroyer",
      location: [6, 3],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [0, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [1, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [2, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [3, 4],
      direction: "eastwards",
    })
    .placeShip({
      type: "submarine",
      location: [4, 4],
      direction: "eastwards",
    });
});

describe("constructor", () => {
  test("not supplying the 2 required arguments throws TypeError", () => {
    expect(() => {
      new Game();
    }).toThrow(new TypeError("too few arguments supplied; 2 are required"));
  });

  test("only supplying 1 argument throws TypeError", () => {
    expect(() => {
      new Game(randomMock);
    }).toThrow(new TypeError("too few arguments supplied; 2 are required"));
  });
});

describe("attack", () => {
  test("attacking a board in 'placement' throws Error", () => {
    expect(() => {
      new Game(randomMock, arraySampleMock).attack([1, 1]);
    }).toThrow(
      new Error("can't start attacking: board still needs ships to be placed")
    );
  });

  test("attacking outside the board throws RangeError", () => {
    // board is 10 x 10
    expect(() => {
      fullyPlacedGame.attack([11, 11]);
    }).toThrow(new RangeError("board coordinates out of bound"));
  });

  test("attacking a fresh spot inside the board returns a new Game instance", () => {
    // board is 10 x 10
    const game1 = fullyPlacedGame;
    const game2 = game1.attack([1, 2]);
    expect(game1).not.toBe(game2);
  });

  test("attacking a spot twice inside the board returns the same Game instance", () => {
    // board is 10 x 10
    const game1 = fullyPlacedGame;
    const game2 = game1.attack([1, 2]);
    const game3 = game2.attack([1, 2]);
    expect(game2).toBe(game3);
  });
});

describe("canPlaceShip", () => {
  test("returns true for new game", () => {
    const result = new Game(randomMock, arraySampleMock).canPlaceShip({
      type: "carrier",
      location: [0, 0],
      direction: "eastwards",
    });
    expect(result).toBe(true);
  });

  test("return false for out-of-bounds ship", () => {
    const result = new Game(randomMock, arraySampleMock).canPlaceShip({
      type: "carrier",
      location: [0, 0],
      direction: "westwards",
    });
    expect(result).toBe(false);
  });
});

describe("placeShip", () => {
  test("throw RangeError for out-of-bounds ship", () => {
    expect(() => {
      new Game(randomMock, arraySampleMock).placeShip({
        type: "carrier",
        location: [0, 0],
        direction: "westwards",
      });
    }).toThrow(new RangeError("placed ship out of bounds"));
  });

  test("throws RangeError for colliding ships", () => {
    expect(() => {
      const game = new Game(randomMock, arraySampleMock).placeShip({
        type: "carrier",
        location: [0, 0],
        direction: "eastwards",
      });
      game.placeShip({
        type: "cruiser",
        location: [0, 2],
        direction: "northwards",
      });
    }).toThrow(
      new RangeError(
        "can't place here: placed ship collided with an existing one"
      )
    );
  });

  test("throws RangeError for adding too many ships of a type", () => {
    expect(() => {
      const game = new Game(randomMock, arraySampleMock).placeShip({
        type: "carrier",
        location: [0, 0],
        direction: "eastwards",
      });
      game.placeShip({
        type: "carrier",
        location: [0, 1],
        direction: "eastwards",
      });
    }).toThrow(
      new RangeError(`the game already has enough ships of type carrier`)
    );
  });
});

describe("getShipInfo", () => {
  test("returns an object", () => {
    const game = new Game(randomMock, arraySampleMock);
    expect(game.getShipInfo()).toEqual(
      expect.objectContaining({
        carrier: { length: 5, numberOfShips: 1 },
        battleship: { length: 4, numberOfShips: 2 },
        cruiser: { length: 3, numberOfShips: 3 },
        destroyer: { length: 2, numberOfShips: 4 },
        submarine: { length: 1, numberOfShips: 5 },
      })
    );
  });
});

describe("getBoards", () => {
  test("returns an initialized board for ai", () => {
    const boards = new Game(randomMock, arraySampleMock).getBoards();
    expect(boards[1].hits).toHaveLength(0);
    expect(boards[1].ships.length).toBeGreaterThan(0);
  });

  test("returns a 'placement' board for player", () => {
    const boards = new Game(randomMock, arraySampleMock).getBoards();
    expect(boards[0].hits).toHaveLength(0);
    expect(boards[0].ships).toHaveLength(0);
  });

  test("ai board is changed after fresh attack", () => {
    const game1 = fullyPlacedGame;
    const result1 = game1.getBoards()[1];
    const game2 = game1.attack([1, 2]);
    const result2 = game2.getBoards()[1];
    expect(result1).not.toBe(result2);
  });

  test("player board is changed after fresh attack", () => {
    const game1 = fullyPlacedGame;
    const result1 = game1.getBoards()[0];
    const game2 = game1.attack([1, 2]);
    const result2 = game2.getBoards()[0];
    expect(result1).not.toBe(result2);
  });
});

describe("getStatus", () => {
  test("returns 'placement' for a new game", () => {
    const result = new Game(randomMock, arraySampleMock).getStatus();
    expect(result).toBe("placement");
  });

  test("returns 'running' after one attack", () => {
    const game = fullyPlacedGame.attack([1, 2]);
    const result = game.getStatus();
    expect(result).toBe("running");
  });

  test("returns initial after all ships have been placed", () => {
    const result = fullyPlacedGame.getStatus();
    expect(result).toBe("initial");
  });

  test("returns 'won' or 'lost' after all ai board spots are hit", () => {
    let game = fullyPlacedGame;
    const boardHeight = game.getBoards()[1].height;
    const boardWidth = game.getBoards()[1].width;

    for (let row = 0; row < boardHeight; row++) {
      for (let column = 0; column < boardWidth; column++) {
        const position = [column, row];
        game = game.attack(position);
      }
    }

    expect(game.getStatus()).toEqual(expect.stringMatching(/won|lost/));
  });
});
