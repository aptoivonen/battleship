import ShipFactory from "./shipfactory";
import GameBoardFactory from "./gameboardfactory";
import perfomAiMove from "./ai";

const shipFactory = new ShipFactory();

class Game {
  #random;
  #sample;
  #gameBoardFactory;
  #playerBoard;
  #aiBoard;
  #shipInfo;

  constructor(randomizeFn, sampleFn, playerBoard, aiBoard, shipInfo) {
    if (arguments.length < 2) {
      throw new TypeError("too few arguments supplied; 2 are required");
    }
    this.#random = randomizeFn;
    this.#sample = sampleFn;
    this.#gameBoardFactory = new GameBoardFactory(
      shipFactory,
      this.#random,
      this.#sample
    );
    this.#playerBoard = playerBoard ?? this.#gameBoardFactory.create("player");
    this.#aiBoard = aiBoard ?? this.#gameBoardFactory.create("ai");
    this.#shipInfo =
      shipInfo ?? this.#createShipInfo(shipFactory, this.#gameBoardFactory);
  }

  get width() {
    return this.#playerBoard.width;
  }

  get height() {
    return this.#playerBoard.height;
  }

  attack([x, y]) {
    if (this.getStatus() === "placement") {
      throw new Error(
        "can't start attacking: board still needs ships to be placed"
      );
    }

    let result = this;

    if (/won|lost/.test(this.getStatus())) {
      return result;
    }

    const newAiBoard = this.#aiBoard.receiveAttack([x, y]);
    if (newAiBoard !== this.#aiBoard) {
      const newPlayerBoard = perfomAiMove(this.#playerBoard, this.#sample);
      result = new Game(
        this.#random,
        this.#sample,
        newPlayerBoard,
        newAiBoard,
        this.#shipInfo
      );
    }

    return result;
  }

  canPlaceShip({ type, location, direction }) {
    return this.#gameBoardFactory.canPlaceShip(this.#playerBoard, {
      type,
      location,
      direction,
    });
  }

  placeShip({ type, location, direction }) {
    const newPlayerBoard = this.#gameBoardFactory.placeShip(this.#playerBoard, {
      type,
      location,
      direction,
      throws: true,
    });
    return new Game(
      this.#random,
      this.#sample,
      newPlayerBoard,
      this.#aiBoard,
      this.#shipInfo
    );
  }

  getShipInfo() {
    return this.#shipInfo;
  }

  getBoards() {
    return [this.#playerBoard, this.#aiBoard];
  }

  getStatus() {
    let result;
    const playerBoardStatus = this.#playerBoard.getStatus();
    const aiBoardStatus = this.#aiBoard.getStatus();
    if (playerBoardStatus === "lost") {
      result = "lost";
    } else if (aiBoardStatus === "lost") {
      result = "won";
    } else if (playerBoardStatus === "placement") {
      result = "placement";
    } else if (playerBoardStatus === "initial" && aiBoardStatus === "initial") {
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
