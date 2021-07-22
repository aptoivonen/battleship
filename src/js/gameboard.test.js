import { expect } from "@jest/globals";
import GameBoard from "./gameboard";

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
