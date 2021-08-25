import ShipFactory from "./shipfactory";
import GameBoardFactory from "./gameboardfactory";
import perfomAiMove from "./ai";

const shipFactory = new ShipFactory();

class Game {
  #random;
  #sample;
  #playerBoard;
  #aiBoard;
  #shipInfo;

  constructor(randomizeFn, sampleFn, playerBoard, aiBoard, shipInfo) {
    if (arguments.length < 2) {
      throw new TypeError("too few arguments supplied; 2 are required");
    }
    this.#random = randomizeFn;
    this.#sample = sampleFn;
    const gameBoardFactory = new GameBoardFactory(
      shipFactory,
      this.#random,
      this.#sample
    );
    this.#playerBoard = playerBoard ?? gameBoardFactory.create("player");
    this.#aiBoard = aiBoard ?? gameBoardFactory.create("ai");
    this.#shipInfo =
      shipInfo ?? this.#createShipInfo(shipFactory, gameBoardFactory);
  }

  get width() {
    return this.#playerBoard.width;
  }

  get height() {
    return this.#playerBoard.height;
  }

  attack([x, y]) {
    let result = this;

    if (/won|lost/.test(this.getStatus())) {
      return result;
    }

    const newAiBoard = this.#aiBoard.receiveAttack([x, y]);
    if (newAiBoard !== this.#aiBoard) {
      const newPlayerBoard = perfomAiMove(this.#playerBoard, this.#sample);
      result = new Game(this.#random, this.#sample, newPlayerBoard, newAiBoard);
    }

    return result;
  }

  getShipInfo() {
    return this.#shipInfo;
  }

  getBoards() {
    return [this.#playerBoard, this.#aiBoard];
  }

  getStatus() {
    let result;
    if (this.#playerBoard.getStatus() === "lost") {
      result = "lost";
    } else if (this.#aiBoard.getStatus() === "lost") {
      result = "won";
    } else if (
      this.#playerBoard.getStatus() === "initial" &&
      this.#aiBoard.getStatus() === "initial"
    ) {
      result = "initial";
    } else {
      result = "running";
    }

    return result;
  }

  #createShipInfo(shipFactoryInstance, gameBoardFactoryInstance) {
    const shipInfoTable = Object.create(null);
    const shipSizeInfo = shipFactoryInstance.getShipSizeInfo();
    const numberOfShipsInfo = gameBoardFactoryInstance.getNumberOfShipsInfo();
    for (const [key, sizeValue] of Object.entries(shipSizeInfo)) {
      const numberValue = numberOfShipsInfo[key];
      shipInfoTable[key] = { ...sizeValue, numberOfShips: numberValue };
    }
    return shipInfoTable;
  }
}

export default Game;
