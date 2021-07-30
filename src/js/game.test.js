import Game from "./game";
import { makeRandomMock } from "./testutils";

describe("attack method", () => {
  test("attacking outside the board throws RangeError", () => {
    // board is 10 x 10
    expect(() => {
      new Game(makeRandomMock()).attack([11, 11]);
    }).toThrow(new RangeError("board coordinates out of bound"));
  });

  test("attacking a fresh spot inside the board returns a new Game instance", () => {
    // board is 10 x 10
    const game1 = new Game(makeRandomMock());
    const game2 = game1.attack([1, 2]);
    expect(game1).not.toBe(game2);
  });

  test("attacking a spot twice inside the board returns the same Game instance", () => {
    // board is 10 x 10
    const game1 = new Game(makeRandomMock());
    const game2 = game1.attack([1, 2]);
    const game3 = game2.attack([1, 2]);
    expect(game2).toBe(game3);
  });
});

describe("attack and subscribe", () => {
  test("attacking outside the board doesn't cause a 'playermove' event to be emitted", () => {
    // board is 10 x 10
    const game = new Game(makeRandomMock());
    const mockFn = jest.fn();
    game.subscribe("playermove", mockFn);
    try {
      game.attack([11, 12]);
      // eslint-disable-next-line no-empty
    } catch {}
    expect(mockFn.mock.calls).toHaveLength(0);
  });

  test("attacking a fresh spot causes a 'playermove' event to be emitted", () => {
    const game = new Game(makeRandomMock());
    const mockFn = jest.fn();
    game.subscribe("playermove", mockFn);
    game.attack([1, 2]);
    expect(mockFn.mock.calls).toHaveLength(1);
    // first argument is the game object
    expect(mockFn.mock.calls[0][0]).toEqual(expect.any(Game));
  });

  test("attacking a spot twice inside the board doesn't cause two 'playermove' events to be emitted", () => {
    // board is 10 x 10
    const game1 = new Game(makeRandomMock());
    const mockFn = jest.fn();
    game1.subscribe("playermove", mockFn);
    const game2 = game1.attack([1, 2]);
    expect(mockFn.mock.calls).toHaveLength(1);
    game2.attack([1, 2]);
    expect(mockFn.mock.calls).toHaveLength(1);
  });

  // TODO: attack => 'aimove'
});

describe("getBoards", () => {
  test("returns two initialized board strings", () => {
    const result = new Game(makeRandomMock()).getBoards();
    expect(result).toHaveLength(2);
    const onlyInitialChars = (chr) => /[.s]/.test(chr);
    const numberOfPlayerBoardInitialChars = result[0]
      .split("")
      .filter(onlyInitialChars);
    const numberOfAiBoardInitialChars = result[1]
      .split("")
      .filter(onlyInitialChars);
    expect(numberOfPlayerBoardInitialChars).toHaveLength(10 * 10);
    expect(numberOfAiBoardInitialChars).toHaveLength(10 * 10);
  });

  test("ai board is changed after fresh attack", () => {
    const game1 = new Game(makeRandomMock());
    const result1 = game1.getBoards()[1];
    const game2 = game1.attack([1, 2]);
    const result2 = game2.getBoards()[1];
    expect(result1).not.toBe(result2);
  });

  // TODO: player board changed after fresh attack
});

describe("getStatus", () => {
  test("returns 'initial' for a new game", () => {
    const result = new Game(makeRandomMock()).getStatus();
    expect(result).toBe("initial");
  });

  test("returns 'running' after one attack", () => {
    const game = new Game(makeRandomMock()).attack([1, 2]);
    const result = game.getStatus();
    expect(result).toBe("running");
  });
});
