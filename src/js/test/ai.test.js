import GameBoardFactory from "../gameboardfactory";
import ShipFactory from "../shipfactory";
import perfomAiMove from "../ai";
import { makeRandomMock, makeArraySampleMock } from "./testutils";

// common shipFactory for all tests
const shipFactory = new ShipFactory();
let playerBoard;
beforeEach(() => {
  playerBoard = new GameBoardFactory(
    shipFactory,
    makeRandomMock(),
    makeArraySampleMock()
  ).create("player");
});

let sampleFn;
beforeEach(() => {
  sampleFn = makeArraySampleMock();
});

test("takes a new board and returns a board with a new hit", () => {
  const resultBoard = perfomAiMove(playerBoard, sampleFn);
  expect(resultBoard.hits).toHaveLength(1);
});

test("returns a new board until board is lost", () => {
  const resultBoards = [];
  let previousBoard = playerBoard;
  for (let i = 0; i < playerBoard.width * playerBoard.height; i++) {
    previousBoard = perfomAiMove(playerBoard, makeArraySampleMock());
    resultBoards.push(previousBoard);
  }
  const boardsWithNewResult = resultBoards.filter(
    (b) => b.getStatus() !== "lost"
  );
  const uniqueBoards = [...new Set(boardsWithNewResult)];
  expect(boardsWithNewResult).toHaveLength(uniqueBoards.length);
});
