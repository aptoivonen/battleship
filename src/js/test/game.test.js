import Game from "../game";
import { makeRandomMock, makeArraySampleMock } from "./testutils";

let randomMock;
let arraySampleMock;

beforeEach(() => {
  randomMock = makeRandomMock();
  arraySampleMock = makeArraySampleMock();
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

describe("attack method", () => {
  test("attacking outside the board throws RangeError", () => {
    // board is 10 x 10
    expect(() => {
      new Game(randomMock, arraySampleMock).attack([11, 11]);
    }).toThrow(new RangeError("board coordinates out of bound"));
  });

  test("attacking a fresh spot inside the board returns a new Game instance", () => {
    // board is 10 x 10
    const game1 = new Game(randomMock, arraySampleMock);
    const game2 = game1.attack([1, 2]);
    expect(game1).not.toBe(game2);
  });

  test("attacking a spot twice inside the board returns the same Game instance", () => {
    // board is 10 x 10
    const game1 = new Game(randomMock, arraySampleMock);
    const game2 = game1.attack([1, 2]);
    const game3 = game2.attack([1, 2]);
    expect(game2).toBe(game3);
  });
});

describe("getBoards", () => {
  test("returns two initialized boards", () => {
    const boards = new Game(randomMock, arraySampleMock).getBoards();
    expect(boards[0].hits).toHaveLength(0);
    expect(boards[1].hits).toHaveLength(0);
    expect(boards[0].ships.length).toBeGreaterThan(0);
    expect(boards[1].ships.length).toBeGreaterThan(0);
  });

  test("ai board is changed after fresh attack", () => {
    const game1 = new Game(randomMock, arraySampleMock);
    const result1 = game1.getBoards()[1];
    const game2 = game1.attack([1, 2]);
    const result2 = game2.getBoards()[1];
    expect(result1).not.toBe(result2);
  });

  test("player board is changed after fresh attack", () => {
    const game1 = new Game(randomMock, arraySampleMock);
    const result1 = game1.getBoards()[0];
    const game2 = game1.attack([1, 2]);
    const result2 = game2.getBoards()[0];
    expect(result1).not.toBe(result2);
  });
});

describe("getStatus", () => {
  test("returns 'initial' for a new game", () => {
    const result = new Game(randomMock, arraySampleMock).getStatus();
    expect(result).toBe("initial");
  });

  test("returns 'running' after one attack", () => {
    const game = new Game(randomMock, arraySampleMock).attack([1, 2]);
    const result = game.getStatus();
    expect(result).toBe("running");
  });

  test("returns 'won' or 'lost' after all ai board spots are hit", () => {
    let game = new Game(randomMock, arraySampleMock);
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
