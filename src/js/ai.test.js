import GameBoardFactory from "./gameboardfactory";
import ShipFactory from "./shipfactory";
import perfomAiMove from "./ai";
import { makeRandomMock } from "./testutils";

// common shipFactory for all tests
const shipFactory = new ShipFactory();

test("takes a new board and returns a board with a new hit", () => {
  const playerBoard = new GameBoardFactory(
    shipFactory,
    makeRandomMock()
  ).create("player");
  const resultBoard = perfomAiMove(playerBoard, makeRandomMock());
  const resultArray = resultBoard.getBoard().split("");
  const onlyHitsAndMisses = (char) => /[xX]/.test(char);
  const onlyInitial = (char) => /[.s]/.test(char);
  expect(resultArray.filter(onlyHitsAndMisses)).toHaveLength(1);
  expect(resultArray.filter(onlyInitial)).toHaveLength(
    playerBoard.width * playerBoard.height - 1
  );
});

test("returns a new board until board is lost", () => {
  const playerBoard = new GameBoardFactory(
    shipFactory,
    makeRandomMock()
  ).create("player");
  const resultBoards = [];
  let previousBoard = playerBoard;
  for (let i = 0; i < playerBoard.width * playerBoard.height; i++) {
    previousBoard = perfomAiMove(playerBoard, makeRandomMock());
    resultBoards.push(previousBoard);
  }
  const boardsWithNewResult = resultBoards.filter(
    (b) => b.getStatus() !== "lost"
  );
  const uniqueBoards = [...new Set(boardsWithNewResult)];
  expect(boardsWithNewResult).toHaveLength(uniqueBoards.length);
});
