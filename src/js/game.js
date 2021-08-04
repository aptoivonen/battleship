import ShipFactory from "./shipfactory";
import GameBoardFactory from "./gameboardfactory";
import pubsubInstance from "./pubsub";
import perfomAiMove from "./ai";

class Game {
  #random;
  #sample;
  #playerBoard;
  #aiBoard;
  #pubsub;

  constructor(randomizeFn, sampleFn, playerBoard, aiBoard, pubsub) {
    if (arguments.length < 2) {
      throw new TypeError("too few arguments supplied; 2 are required");
    }
    this.#random = randomizeFn;
    this.#sample = sampleFn;
    const gameBoardFactory = new GameBoardFactory(
      new ShipFactory(),
      this.#random,
      this.#sample
    );
    this.#playerBoard = playerBoard ?? gameBoardFactory.create("player");
    this.#aiBoard = aiBoard ?? gameBoardFactory.create("ai");
    this.#pubsub = pubsub ?? pubsubInstance;
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
      const playerResult = new Game(
        this.#random,
        this.#sample,
        this.#playerBoard,
        newAiBoard,
        this.#pubsub
      );
      this.#pubsub.publish("playermove", playerResult);
      const newPlayerBoard = perfomAiMove(this.#playerBoard, this.#sample);
      result = new Game(
        this.#random,
        this.#sample,
        newPlayerBoard,
        newAiBoard,
        this.#pubsub
      );
      if (newPlayerBoard !== this.#playerBoard) {
        this.#pubsub.publish("aimove", result);
      }
    }

    return result;
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

  subscribe(topic, fn) {
    this.#pubsub.subscribe(topic, fn);
  }

  unsubscribe(topic, fn) {
    this.#pubsub.unsubscribe(topic, fn);
  }
}

export default Game;
