import Game from "./game";
import { makeRandomMock } from "./testutils";

describe("attack method", () => {
  test("attacking outside the board returns false", () => {
    // board is 10 x 10
    const result = new Game(makeRandomMock()).attack([11, 11]);
    expect(result).toBe(false);
  });

  test("attacking a fresh spot inside the board returns true", () => {
    // board is 10 x 10
    const result = new Game(makeRandomMock()).attack([1, 2]);
    expect(result).toBe(true);
  });

  test("attacking a spot twice inside the board returns false", () => {
    // board is 10 x 10
    const game = new Game(makeRandomMock());
    game.attack([1, 2]);
    const result = game.attack([1, 2]);
    expect(result).toBe(false);
  });
});

describe("attack and subscribe", () => {
  test("attacking outside the board doesn't cause a 'playermove' event to be emitted", () => {
    // board is 10 x 10
    const game = new Game(makeRandomMock());
    const mockFn = jest.fn();
    game.subscribe("playermove", mockFn);
    game.attack([11, 12]);
    expect(mockFn.mock.calls).toHaveLength(0);
  });

  test("attacking a fresh spot causes a 'playermove' event to be emitted", () => {
    const game = new Game(makeRandomMock());
    const mockFn = jest.fn();
    game.subscribe("playermove", mockFn);
    game.attack([1, 2]);
    expect(mockFn.mock.calls).toHaveLength(1);
  });

  test("attacking a spot twice inside the board doesn't cause two 'playermove' events to be emitted", () => {
    // board is 10 x 10
    const game = new Game(makeRandomMock());
    const mockFn = jest.fn();
    game.subscribe("playermove", mockFn);
    game.attack([1, 2]);
    expect(mockFn.mock.calls).toHaveLength(1);
    game.attack([1, 2]);
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
    const game = new Game(makeRandomMock());
    const result1 = game.getBoards()[1];
    game.attack([1, 2]);
    const result2 = game.getBoards()[1];
    expect(result1).not.toBe(result2);
  });

  // TODO: player board changed after fresh attack
});
