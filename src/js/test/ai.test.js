import GameBoardFactory from "../gameboardfactory";
import ShipFactory from "../shipfactory";
import perfomAiMove from "../ai";
import { makeRandomMock, makeArraySampleMock } from "./testutils";

// common shipFactory for all tests
const shipFactory = new ShipFactory();
let gameBoardFactory;
let resultBoard;
beforeEach(() => {
  gameBoardFactory = new GameBoardFactory(
    shipFactory,
    makeRandomMock(),
    makeArraySampleMock()
  );
  const initialBoard = gameBoardFactory.create("player");
  resultBoard = gameBoardFactory.placeShip(initialBoard, {
    type: "carrier",
    location: [0, 0],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "battleship",
    location: [0, 1],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "battleship",
    location: [4, 1],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "cruiser",
    location: [0, 2],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "cruiser",
    location: [3, 2],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "cruiser",
    location: [6, 2],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "destroyer",
    location: [0, 3],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "destroyer",
    location: [2, 3],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "destroyer",
    location: [4, 3],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "destroyer",
    location: [6, 3],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "submarine",
    location: [0, 4],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "submarine",
    location: [1, 4],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "submarine",
    location: [2, 4],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "submarine",
    location: [3, 4],
    direction: "eastwards",
  });
  resultBoard = gameBoardFactory.placeShip(resultBoard, {
    type: "submarine",
    location: [4, 4],
    direction: "eastwards",
  });
});

let sampleFn;
beforeEach(() => {
  sampleFn = makeArraySampleMock();
});

test("takes a new board and returns a board with a new hit", () => {
  resultBoard = perfomAiMove(resultBoard, sampleFn);
  expect(resultBoard.hits).toHaveLength(1);
});

test("returns a new board until board is lost", () => {
  const resultBoards = [];
  let previousBoard = resultBoard;
  for (let i = 0; i < resultBoard.width * resultBoard.height; i++) {
    previousBoard = perfomAiMove(resultBoard, makeArraySampleMock());
    resultBoards.push(previousBoard);
  }
  const boardsWithNewResult = resultBoards.filter(
    (b) => b.getStatus() !== "lost"
  );
  const uniqueBoards = [...new Set(boardsWithNewResult)];
  expect(boardsWithNewResult).toHaveLength(uniqueBoards.length);
});
